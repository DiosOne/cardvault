import { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { TradeContext } from '../context/TradeContext';
import { getMessage, resolveApiError } from '../utility/messages';

export default function PublicTrades() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const { fetchTrades } = useContext(TradeContext);
  const userId = user?._id || user?.id;

  useEffect(() => {
    const fetchPublicCards = async () => {
      try {
        const res = await API.get('/cards/public');
        setCards(res.data.data || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setCards([]);
        } else {
          setError(resolveApiError(err, 'PUBLIC_TRADES_ERROR'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPublicCards();
  }, []);

  const handleRequestTrade = async (card) => {
    if (!userId) {
      alert(getMessage('AUTH_REQUIRED'));
      return;
    }

    const ownerId = card.userId?._id || card.userId?.id || card.userId;
    if (ownerId === userId) {
      alert(getMessage('OWN_LISTING'));
      return;
    }

    const messageInput = window.prompt(
      'Add a note for your trade request (optional):',
      '',
    );
    const message = messageInput?.trim() || '';
    if (!message) {
      alert(getMessage('MESSAGE_REQUIRED'));
      return;
    }

    try {
      await API.post('/trades', {
        toUser: ownerId,
        cardId: card._id,
        message,
      });
      alert(getMessage('TRADE_SEND_SUCCESS'));
      fetchTrades();
    } catch (err) {
      alert(resolveApiError(err, 'TRADE_SEND_ERROR'));
    }
  };

  if (loading)
    return (
      <section className='loading' aria-busy='true' aria-live='polite'>
        <p>Loading public trades...</p>
      </section>
    );

  return (
    <main className='public-trades' role='main' aria-labelledby='public-trades-heading'>
      <header>
        <h2 id='public-trades-heading'>Public Trade Listings</h2>
      </header>

      {error && (
        <section className='error' role='alert'>
          <p>{error}</p>
        </section>
      )}

      {cards.length === 0 ? (
        <p>No cards currently listed for trade.</p>
      ) : (
        <section aria-live='polite'>
          <ul aria-label='List of cards, up for public trade'>
            {cards.map((card) => (
              <li key={card._id}>
                <article className='card' aria-label={`Card: ${card.name}`}>
                  <h3>{card.name}</h3>
                  <p>
                    <strong>Rarity:</strong> {card.rarity} <br />
                    <strong>Type:</strong> {card.type} <br />
                    <strong>Value:</strong> {card.value} <br />
                  </p>
                  <small>Listed by: {card.userId?.username || 'Unknown user'}</small>
                  <footer className='card-actions'>
                    <button
                      type='button'
                      onClick={() => handleRequestTrade(card)}
                      aria-label={`Request trade for ${card.name}`}
                    >
                      Request Trade
                    </button>
                  </footer>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
