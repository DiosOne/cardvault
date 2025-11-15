import { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import CardForm from '../components/CardForm';
import CardList from '../components/CardList';
import CardPanel from '../components/CardPanel';
import {AuthContext} from '../context/AuthContext';
import EditCardForm from '../components/EditCardForm';
import { TradeContext } from '../context/TradeContext';
import { NavLink } from 'react-router-dom';
import { MdNotificationsActive } from 'react-icons/md';
import { resolveApiError } from '../utility/messages';
import { notifySuccess, notifyError, confirmAction } from '../utility/notifications';


export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCard, setEditingCard] = useState(null);
  const {user} = useContext(AuthContext);
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
      notifySuccess('CARD_ADD_SUCCESS');
    } catch (err) {
      notifyError(err, 'CARD_ADD_ERROR');
    }
  };

  //delete a card
  const handleDeleteCard= async (id) => {
    if (!confirmAction('CARD_DELETE_CONFIRM')) return;
    try {
      await API.delete(`/cards/${id}`);
      setCards(cards.filter((card) => card._id !== id));
      notifySuccess('CARD_DELETE_SUCCESS');
    } catch (err) {
      notifyError(err, 'CARD_DELETE_ERROR');
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
        <p>Loading your cards...</p>
      </section>
    );

  if (error)
    return (
      <section className='error' role='alert'>
        <p>{error}</p>
      </section>
    );

  return (
    <main className='dashboard' role='main'>
      <header className='dashboard-header'>
        <div>
          <h2>Welcome, {user?.username}!</h2>
          <p className='dashboard-subtitle'>
            Manage your collection and keep tabs on incoming trades.
          </p>
        </div>
        <div className='dashboard-actions'>
          {hasNewTrades ? (
            <NavLink to='/trades' className='btn secondary dashboard-alert'>
              <MdNotificationsActive className='trade-bell' aria-label='New trade requests' />
              <span>View Trade Inbox</span>
            </NavLink>
          ) : (
            <NavLink to='/trades' className='btn secondary'>
              Go to Trade Inbox
            </NavLink>
          )}
        </div>
      </header>
      <CardPanel
        title='Your Cards'
        description='Keep your owned, wanted, and trade-ready cards organised.'
      >
        <CardForm onAdd={handleAddCard} />

        {editingCard && (
          <EditCardForm
            card={editingCard}
            onSave={handleSaveCard}
            onCancel={handleCancelEdit}
          />
        )}

        <CardList
          cards={cards}
          onEdit={handleEditCard}
          onDelete={handleDeleteCard}
        />
      </CardPanel>
    </main>
  );
}
