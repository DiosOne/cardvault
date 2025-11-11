import { useEffect, useState } from 'react';
import API from '../api/api';

export default function PublicTrades() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPublicCards= async () => {
      try {
        const res= await API.get('/cards/public');
        setCards(res.data.data || []);
      } catch (err) {
        //no 404json on screen
        if (err.response?.status === 404) {
          setCards([]);
        } else {
          alert(err.response?.data?.message || 'Failed to load public trade cards');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPublicCards();
  }, []);
  
  if (loading) 
    return (
      <section className='loading' aria-busy='true' aria-live='polite' >
        <p>Loading public trades...</p>
      </section>
    );
  
  return (
    <main className='public-trades' role='main' aria-labelledby='public-trades-heading'>
      <header> 
        <h2 id='public-trades-heading'>Public Trade Listings</h2>
      </header>

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
                    <strong>Rarity:</strong> {card.rarity} <br/>
                    <strong>Type:</strong> {card.type} <br/>
                    <strong>Value:</strong> {card.value} <br/>
                  </p>
                  <small>Listed by: {card.userId?.username || 'Unknown user'}</small>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
