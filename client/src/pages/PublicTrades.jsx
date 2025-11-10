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
        alert(err.response?.data?.message || 'Failed to load public trade cards');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicCards();
  }, []);
  
  if (loading) return <p>Loading public trades...</p>;
  
  return (
    <div className='public-trades'>
      <h2>Public Trade Listings</h2>
      {cards.length === 0 ? (
        <p>No cards currently listed for trade.</p>
      ) : (
        <ul>
          {cards.map((card) => (
            <li key={card._id}>
              <strong>{card.name}</strong> ({card.rarity})
              <br />
              {card.type} - Value: {card.value ?? '?'}
              <br />
              <small>Listed by: {card.userId?.username}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}