import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import API from '../api/api';
import { AuthContext } from './AuthContext';
import { TradeContext } from './TradeContext';
import { notifyError } from '../utility/notifications';

/**
 * Normalize an entity ID from a string or Mongo-style object.
 * @param {string|{_id?: string, id?: string}|null|undefined} entity
 * @returns {string|null}
 */
const getEntityId= (entity) => {
  if (!entity) return null;
  if (typeof entity === 'string') return entity;
  return entity._id || entity.id || null;
};

/**
 * Read the last-seen timestamp for the trade inbox from localStorage.
 * @returns {number}
 */
const getStoredSeenAt= () => {
  if (typeof window === 'undefined') return 0;
  const stored= window.localStorage.getItem('tradeInboxSeenAt');
  return stored ? Number(stored) : 0;
};

/**
 * Provide trade inbox data and actions to descendant components.
 * @param {{ children: import('react').ReactNode }} props
 * @returns {JSX.Element}
 */
export const TradeProvider= ({ children }) => {
  const {user} = useContext(AuthContext);
  const userId= getEntityId(user);
  const [trades, setTrades] = useState([]);
  const [hasNewTrades, setHasNewTrades] = useState(false);
  const lastSeenRef= useRef(getStoredSeenAt());

  //fetch trades for user
  /**
   * Fetch trade data for the authenticated user and update notification state.
   * @returns {Promise<void>}
   */
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
        //Fallback to "now" when timestamps are missing to avoid false positives.
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
  /**
   * Trigger trade fetches when the dependency changes.
   * @returns {void}
   */
  const handleFetchTradesEffect= () => {
    fetchTrades();
  };

  useEffect(handleFetchTradesEffect, [fetchTrades]);

  /**
   * Respond to a trade request and refresh the list.
   * @param {string} tradeId
   * @param {{ status?: string, responseMessage?: string }} payload
   * @returns {Promise<object|undefined>}
   */
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

  /**
   * Clear notification state and persist the latest "seen" timestamp.
   * @returns {void}
   */
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
