import { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { TradeContext } from '../context/TradeContext';
import { getMessage, resolveApiError } from '../utility/messages';
import { notifySuccess, notifyError } from '../utility/notifications';

const STATUS_META = {
  owned: { key: 'owned', label: 'Owned', pill: 'Owned', className: 'owned' },
  'for trade': { key: 'for trade', label: 'For Trade', pill: 'For Trade', className: 'trade' },
  wanted: { key: 'wanted', label: 'Wanted', pill: 'Wanted', className: 'wanted' },
};

/**
 * Normalize various status labels into canonical keys for rendering.
 * @param {string} status
 * @returns {'owned'|'for trade'|'wanted'}
 */
const normalizeStatus = (status) => {
  const normalized = (status || 'for trade').toString().toLowerCase().trim();
  if (
    normalized === 'for trade' ||
    normalized === 'fortrade' ||
    normalized === 'for-trade' ||
    normalized === 'trade'
  ) {
    return 'for trade';
  }
  if (normalized === 'owned' || normalized === 'wanted') {
    return normalized;
  }
  return 'for trade';
};

/**
 * Public trade listings page with request flow.
 * @returns {JSX.Element}
 */
export default function PublicTrades() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const { fetchTrades } = useContext(TradeContext);
  const userId = user?._id || user?.id;

  /**
   * Fetch public trade cards for the listing view.
   * @returns {Promise<void>}
   */
  const fetchPublicCards = async () => {
    try {
      const res = await API.get('/cards/public');
      setCards(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setCards([]);
      } else {
        const friendly= resolveApiError(err, 'PUBLIC_TRADES_ERROR');
        setError(friendly);
        notifyError(err, 'PUBLIC_TRADES_ERROR');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Trigger fetch of public cards on mount.
   * @returns {void}
   */
  const handleFetchPublicCardsEffect= () => {
    fetchPublicCards();
  };

  useEffect(handleFetchPublicCardsEffect, []);

  /**
   * Submit a trade request for a selected card.
   * @param {{ _id: string, userId?: { _id?: string, id?: string }|string, name?: string }} card
   * @returns {Promise<void>}
   */
  const handleRequestTrade = async (card) => {
    if (!userId) {
      notifyError(getMessage('AUTH_REQUIRED'));
      return;
    }

    const ownerId = card.userId?._id || card.userId?.id || card.userId;
    if (ownerId === userId) {
      notifyError(getMessage('OWN_LISTING'));
      return;
    }

    const messageInput = window.prompt(
      'Add a note for your trade request (optional):',
      '',
    );
    if (messageInput === null) return;
    const message = messageInput.trim();

    try {
      await API.post('/trades', {
        toUser: ownerId,
        cardId: card._id,
        message,
      });
      notifySuccess('TRADE_SEND_SUCCESS');
      fetchTrades();
    } catch (err) {
      notifyError(err, 'TRADE_SEND_ERROR');
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

      {!user && (
        <section className='trade-auth-cta'>
          <p>Sign in or create an account to send trade requests.</p>
          <div className='cta-buttons'>
            <NavLink className='btn primary' to='/login'>
              Login
            </NavLink>
            <NavLink className='btn secondary' to='/register'>
              Register
            </NavLink>
          </div>
        </section>
      )}

      {cards.length === 0 ? (
        <p>No cards currently listed for trade.</p>
      ) : (
        <section aria-live='polite'>
          <ul aria-label='List of cards, up for public trade'>
            {cards.map((card, index) => {
              const statusKey = normalizeStatus(card.status);
              const statusMeta = STATUS_META[statusKey];
              return (
                <li key={card._id}>
                  <article className='card' aria-label={`Card: ${card.name}`}>
                    <img
                      src={`https://picsum.photos/200/300?grayscale&random=${index + 1}`}
                      alt={`${card.name} placeholder artwork`}
                      width='200'
                      height='300'
                    />
                    <header className='card-item__header'>
                      <h3>{card.name}</h3>
                      <span className={`card-status-pill card-status-pill--${statusMeta.className}`}>
                        {statusMeta.pill}
                      </span>
                    </header>
                    <p>
                      <strong>Rarity:</strong> {card.rarity} <br />
                      <strong>Type:</strong> {card.type} <br />
                      <strong>Value:</strong> {card.value}
                    </p>
                    <small>Listed by: {card.userId?.username || 'Unknown user'}</small>
                    <footer className='card-actions'>
                      <button
                        type='button'
                        onClick={() => handleRequestTrade(card)}
                        aria-label={`Request trade for ${card.name}`}
                        disabled={!userId}
                      >
                        {userId ? 'Request Trade' : 'Sign in to trade'}
                      </button>
                    </footer>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
