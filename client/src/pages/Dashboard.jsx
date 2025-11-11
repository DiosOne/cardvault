import { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import CardForm from '../components/CardForm';
import CardList from '../components/CardList';
import {AuthContext} from '../context/AuthContext';
import EditCardForm from '../components/EditCardForm';
import { TradeContext } from '../context/TradeContext';
import { NavLink } from 'react-router-dom';
import { MdNotificationsActive } from 'react-icons/md';
import { getMessage, resolveApiError } from '../utility/messages';

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCard, setEditingCard] = useState(null);
  const {user, logout} = useContext(AuthContext);
  const {hasNewTrades} = useContext(TradeContext);

  //fetch cards when page loads
  useEffect(() => {
    const fetchCards= async () => {
      try {
        const res = await API.get('/cards');
        setCards(res.data.data || []);
      } catch (err) {
        setError(resolveApiError(err, 'CARD_FETCH_ERROR'));
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
      alert(getMessage('CARD_ADD_SUCCESS'));
    } catch (err) {
      alert(resolveApiError(err, 'CARD_ADD_ERROR'));
    }
  };

  //delete a card
  const handleDeleteCard= async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await API.delete(`/cards/${id}`);
      setCards(cards.filter((card) => card._id !== id));
      alert(getMessage('CARD_DELETE_SUCCESS'));
    } catch (err) {
      alert(resolveApiError(err, 'CARD_DELETE_ERROR'));
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
      
      <section className='trade-inbox-link'>
        {hasNewTrades ? (
          <p> 
            <MdNotificationsActive className="trade-bell" aria-label="New trade requests"/>
              You have new trade requests{' '}
            <NavLink to='/trades' className='btn secondary'>
              View Trade Inbox
            </NavLink>
          </p>
        ) : ( 
          <NavLink to='/trades' className='btn secondary'>
            Go to Trade Inbox
          </NavLink>
        )}
      </section>
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
