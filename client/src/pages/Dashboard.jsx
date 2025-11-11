import { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import CardForm from '../components/CardForm';
import CardList from '../components/CardList';
import {AuthContext} from '../context/AuthContext';
import EditCardForm from '../components/EditCardForm';

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCard, setEditingCard] = useState(null);
  const {user, logout} = useContext(AuthContext);

  //fetch cards when page loads
  useEffect(() => {
    const fetchCards= async () => {
      try {
        const res = await API.get('/cards');
        setCards(res.data.data || []);
      } catch {
        setError('Failed to load your cards. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  //add new card
  const handleAddCard= async (cardData) => {
    try {
      const res= await API.post('/cards', cardData);
      const newCard= res.data.data || res.data;
      setCards([...cards, newCard]);
      alert('Card added successfully!');
    } catch (err) {
      console.error('Failed to add card:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      alert('Failed to add card!');
    }
  };

  //delete a card
  const handleDeleteCard= async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await API.delete(`/cards/${id}`);
      setCards(cards.filter((card) => card._id !== id));
      alert('Card deleted successfully!');
    } catch {
      alert('Delete failed!');
    }
  };

  //edit a card
  const handleEditCard= (card) => setEditingCard(card);

  const handleSaveCard= (updatedCard) => {
    setCards(cards.map((c) => (c._id === updatedCard._id ? updatedCard : c)));
    setEditingCard(null);
  };

  const handleCancelEdit= () => setEditingCard(null);

  //loads and errors
  if (loading) 
    return (
      <section className='loading' aria-busy='true' aria-live='polite'>
        <p>Loading your cards...</p>;
      </section>
    );

  if (error) 
    return ( 
      <section className='error' role='alert'>
        <p>{error}</p>;
      </section>
    );

  return (
    <main className='dashboard' role='main'>
      <header className='dashboard-header'>
        <h2>Welcome, {user?.username}!</h2>
        <button 
          type="button" 
          onClick={logout} 
          aria-label='Log out of CardVault'>
          Logout
        </button>
      </header>
      
      <section className='dashboard-cards'>
        <p>Your Cards</p>
        
        <CardForm onAdd={handleAddCard}/>
        
        {editingCard && (
          <EditCardForm
            card={editingCard}
            onSave={handleSaveCard}
            onCancel={handleCancelEdit}/>
        )}

        <CardList
          cards={cards}
          onEdit={handleEditCard}
          onDelete={handleDeleteCard}/>
      </section>
    </main>
  );
}
