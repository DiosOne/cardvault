import { useContext, useEffect } from 'react';
import { TradeContext } from '../context/TradeContext';
import { AuthContext } from '../context/AuthContext';

const getId= (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value._id || value.id || null;
};

export default function TradeInbox() {
  const {user} = useContext(AuthContext);
  const {trades, fetchTrades, clearNotifications} = useContext(TradeContext);
  const userId= getId(user);

  useEffect(() => {
    fetchTrades();
    clearNotifications();
  }, [fetchTrades, clearNotifications]);

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
        {trades.map((trade) => {
          const incoming= getId(trade.toUser) === userId;
          const counterparty= incoming ? trade.fromUser : trade.toUser;

          return (
            <article key={trade._id} className='trade-card' aria-label='Trade request'>
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
            </article>
          );
        })}
      </section>
    </main>
  );
}
