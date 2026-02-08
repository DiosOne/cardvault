import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import API from '../api/api';
import { AuthContext } from './AuthContext';
import { TradeContext } from './TradeContext';
import { notifyError } from '../utility/notifications';

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
  const userId= getEntityId(user);
  const [trades, setTrades] = useState([]);
  const [hasNewTrades, setHasNewTrades] = useState(false);
  const lastSeenRef= useRef(getStoredSeenAt());

  //fetch trades for user
  const fetchTrades= useCallback(async () => {
    if (!userId) {
      setTrades([]);
      setHasNewTrades(false);
      return;
    }

    try {
      const res= await API.get('/trades');
      const data= res.data.data || res.data;
      setTrades(data);

      //check for new or pending trades in a single pass
      const lastSeen= lastSeenRef.current;
      const fallbackCreated= Date.now();
      let hasFreshPending= false;
      for (const trade of data) {
        if (getEntityId(trade.toUser) !== userId || trade.status !== 'pending') {
          continue;
        }
        const created= trade.createdAt ? new Date(trade.createdAt).getTime() : fallbackCreated;
        if (created > lastSeen) {
          hasFreshPending= true;
          break;
        }
      }
      setHasNewTrades(hasFreshPending);
    } catch (err) {
      console.error('Failed to fetch trades', err);
      notifyError(err, 'TRADE_FETCH_ERROR');
    }
  }, [userId]);

  //fetch on login
  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const respondToTrade= useCallback(
    async (tradeId, payload) => {
      if (!tradeId) return;
      try {
        const res= await API.patch(`/trades/${tradeId}`, payload);
        await fetchTrades();
        return res.data.data || res.data;
      } catch (error) {
        console.error('Unable to update trade', error);
        throw error;
      }
    },
    [fetchTrades],
  );

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
      value={{
        trades,
        setTrades,
        hasNewTrades,
        fetchTrades,
        clearNotifications,
        respondToTrade,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};
