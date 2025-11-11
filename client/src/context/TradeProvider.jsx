import { useContext, useEffect, useState, useCallback } from 'react';
import API from '../api/api';
import { AuthContext } from './AuthContext';
import { TradeContext } from './TradeContext';

const getEntityId= (entity) => {
  if (!entity) return null;
  if (typeof entity === 'string') return entity;
  return entity._id || entity.id || null;
};

export const TradeProvider= ({ children }) => {
  const {user} = useContext(AuthContext);
  const [trades, setTrades] = useState([]);
  const [hasNewTrades, setHasNewTrades] = useState(false);

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
      setHasNewTrades(pending.length > 0);
    } catch (err) {
      console.error('Failed to fetch trades', err);
    }
  }, [user]);

  //fetch on login
  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const clearNotifications= useCallback(() => setHasNewTrades(false), []);

  return (
    <TradeContext.Provider
      value={{ trades, setTrades, hasNewTrades, fetchTrades, clearNotifications }}
    >
      {children}
    </TradeContext.Provider>
  );
};
