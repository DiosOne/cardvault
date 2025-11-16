import { useContext, useEffect, useState } from 'react';
import { TradeContext } from '../context/TradeContext';
import { AuthContext } from '../context/AuthContext';
import { notifyError, notifySuccess } from '../utility/notifications';

const getId= (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value._id || value.id || null;
};

export default function TradeInbox() {
  const {user} = useContext(AuthContext);
  const {trades, fetchTrades, clearNotifications, respondToTrade} = useContext(TradeContext);
  const userId= getId(user);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    fetchTrades();
    clearNotifications();
  }, [fetchTrades, clearNotifications]);

  const handleResponseChange= (tradeId, value) => {
    setResponses((prev) => ({...prev, [tradeId]: value}));
  };

  const handleTradeAction= async (tradeId, action) => {
    try {
      await respondToTrade(tradeId, {
        status: action,
        responseMessage: responses[tradeId] || '',
      });
      notifySuccess(action === 'accepted' ? 'TRADE_ACCEPT_SUCCESS' : 'TRADE_DECLINE_SUCCESS');
      setResponses((prev) => ({...prev, [tradeId]: ''}));
    } catch (error) {
      notifyError(error, 'TRADE_ACTION_ERROR');
    }
  };

  const renderHeader= () => (
    <header className='trade-inbox__header'>
      <div>
        <h2>Trade Inbox</h2>
        <p>Review the trade requests tied to your account.</p>
      </div>
      <button type='button' onClick={fetchTrades} aria-label='Refresh trade inbox'>
        Refresh
      </button>
    </header>
  );

  if (!trades.length) {
    return (
      <main className='trade-inbox' role='main'>
        {renderHeader()}
        <section className='trade-empty' aria-live='polite'>
          <p>No trade activity yet. Visit Public Trades to start a request.</p>
        </section>
      </main>
    );
  }

  return (
    <main className='trade-inbox' role='main'>
      {renderHeader()}

      <section className='trade-list' aria-live='polite'>
        {trades.map((trade, index) => {
          const incoming= getId(trade.toUser) === userId;
          const counterparty= incoming ? trade.fromUser : trade.toUser;

          return (
            <article key={trade._id} className='trade-card' aria-label='Trade request'>
              <img 
                src={`https://picsum.photos/200/300?grayscale&random=${index + 1}`} 
                alt={`${trade.cardId?.name || 'Trade card'} placeholder`} 
                width="200" 
                height="300"
              />
              <header>
                <span className={`trade-badge ${incoming ? 'incoming' : 'outgoing'}`}>
                  {incoming ? 'Incoming' : 'Outgoing'}
                </span>
                <p>
                  Card: <strong>{trade.cardId?.name || 'Unnamed card'}</strong>
                </p>
              </header>

              <p className='trade-message'>
                {trade.message || 'No message provided.'}
              </p>

              <ul className='trade-meta'>
                <li>
                  {incoming ? 'From' : 'To'}: {counterparty?.username || 'Unknown user'}
                </li>
                <li>Status: {trade.status}</li>
                <li>
                  Requested:{' '}
                  {trade.createdAt ? new Date(trade.createdAt).toLocaleString() : 'N/A'}
                </li>
              </ul>

              {trade.responseMessage && (
                <p className='trade-response'>
                  Response: {trade.responseMessage}
                </p>
              )}

              {incoming && trade.status === 'pending' && !trade.responseMessage && (
                <div className='trade-actions'>
                  <label htmlFor={`trade-reply-${trade._id}`}>Reply message</label>
                  <textarea
                    id={`trade-reply-${trade._id}`}
                    value={responses[trade._id] || ''}
                    onChange={(event) => handleResponseChange(trade._id, event.target.value)}
                    placeholder='Add a short note for this trader'
                  />
                  <div className='trade-actions__buttons'>
                    <button
                      type='button'
                      className='accept'
                      onClick={() => handleTradeAction(trade._id, 'accepted')}
                    >
                      Accept
                    </button>
                    <button
                      type='button'
                      className='decline'
                      onClick={() => handleTradeAction(trade._id, 'declined')}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
