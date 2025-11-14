import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import API from '../api/api';
import { AuthContext } from './AuthContext';
import { TradeContext } from './TradeContext';

const getEntityId= (entity) => {
  if (!entity) return null;
  if (typeof entity === 'string') return entity;
  return entity._id || entity.id || null;
};

const getStoredSeenAt= () => {
  if (typeof window === 'undefined') return 0;
  const stored= window.localStorage.getItem('tradeInboxSeenAt');
  return stored ? Number(stored) : 0;
};

export const TradeProvider= ({ children }) => {
  const {user} = useContext(AuthContext);
  const [trades, setTrades] = useState([]);
  const [hasNewTrades, setHasNewTrades] = useState(false);
  const lastSeenRef= useRef(getStoredSeenAt());

  //fetch trades for user
  const fetchTrades= useCallback(async () => {
    const userId= getEntityId(user);

    if (!userId) {
      setTrades([]);
      setHasNewTrades(false);
      return;
    }

    try {
      const res= await API.get('/trades');
      const data= res.data.data || res.data;
      setTrades(data);

      //check for new or pending trades
      const pending= data.filter(
        (trade) => getEntityId(trade.toUser) === userId && trade.status === 'pending',
      );
      const hasFreshPending= pending.some((trade) => {
        const created= trade.createdAt ? new Date(trade.createdAt).getTime() : Date.now();
        return created > lastSeenRef.current;
      });
      setHasNewTrades(hasFreshPending);
    } catch (err) {
      console.error('Failed to fetch trades', err);
    }
  }, [user]);

  //fetch on login
  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const clearNotifications= useCallback(() => {
    const now= Date.now();
    setHasNewTrades(false);
    lastSeenRef.current= now;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tradeInboxSeenAt', String(now));
    }
  }, []);

  return (
    <TradeContext.Provider
      value={{ trades, setTrades, hasNewTrades, fetchTrades, clearNotifications }}
    >
      {children}
    </TradeContext.Provider>
  );
};
