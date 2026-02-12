import { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import CardForm from '../components/CardForm';
import CardList from '../components/CardList';
import CardPanel from '../components/CardPanel';
import {AuthContext} from '../context/AuthContext';
import EditCardForm from '../components/EditCardForm';
import { TradeContext } from '../context/TradeContext';
import { resolveApiError } from '../utility/messages';
import { notifySuccess, notifyError, confirmAction } from '../utility/notifications';
import TradeAlertButton from '../components/TradeAlertButton';


/**
 * Dashboard page for managing the user's card collection.
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCard, setEditingCard] = useState(null);
  const {user} = useContext(AuthContext);
  const {hasNewTrades} = useContext(TradeContext);

  //fetch cards when page loads
  /**
   * Fetch cards for the current user from the API.
   * @returns {Promise<void>}
   */
  const fetchCards= async () => {
    try {
      const res = await API.get('/cards');
      setCards(res.data.data || []);
    } catch (err) {
      const friendly= resolveApiError(err, 'CARD_FETCH_ERROR');
      setError(friendly);
      notifyError(err, 'CARD_FETCH_ERROR');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Trigger card fetching on mount.
   * @returns {void}
   */
  const handleFetchCardsEffect= () => {
    fetchCards();
  };

  useEffect(handleFetchCardsEffect, []);

  //add new card
  /**
   * Add a new card to the collection.
   * @param {{ name: string, type: string, rarity: string, value: number, status: string }} cardData
   * @returns {Promise<void>}
   */
  const handleAddCard= async (cardData) => {
    try {
      const res= await API.post('/cards', cardData);
      const newCard= res.data.data || res.data;
      setCards((prev) => [...prev, newCard]);
      notifySuccess('CARD_ADD_SUCCESS');
    } catch (err) {
      notifyError(err, 'CARD_ADD_ERROR');
    }
  };

  //delete a card
  /**
   * Delete a card by ID after confirmation.
   * @param {string} id
   * @returns {Promise<void>}
   */
  const handleDeleteCard= async (id) => {
    if (!confirmAction('CARD_DELETE_CONFIRM')) return;
    try {
      await API.delete(`/cards/${id}`);
      setCards((prev) => prev.filter((card) => card._id !== id));
      notifySuccess('CARD_DELETE_SUCCESS');
    } catch (err) {
      notifyError(err, 'CARD_DELETE_ERROR');
    }
  };

  /**
   * Mark a card as available for trade.
   * @param {{ _id: string }} card
   * @returns {Promise<void>}
   */
  const handleMoveToTrade = async (card) => {
    try {
      const res= await API.patch(`/cards/${card._id}`, {status: 'for trade'});
      const updatedCard= res.data.data || res.data;
      setCards((prev) => prev.map((c) => (c._id === updatedCard._id ? updatedCard : c)));
      notifySuccess('CARD_UPDATE_SUCCESS');
    } catch (err) {
      notifyError(err, 'CARD_UPDATE_ERROR');
    }
  };

  /**
   * Remove a card from trade listings and mark as owned.
   * @param {{ _id: string }} card
   * @returns {Promise<void>}
   */
  const handleCancelTrade = async (card) => {
    try {
      const res= await API.patch(`/cards/${card._id}`, {status: 'owned'});
      const updatedCard= res.data.data || res.data;
      setCards((prev) => prev.map((c) => (c._id === updatedCard._id ? updatedCard : c)));
      notifySuccess('CARD_UPDATE_SUCCESS');
    } catch (err) {
      notifyError(err, 'CARD_UPDATE_ERROR');
    }
  };

  /**
   * Create a wanted-card entry from an existing card's details.
   * @param {{ name: string, type: string, rarity: string, value: number, description?: string }} card
   * @returns {Promise<void>}
   */
  const handleAddWanted = async (card) => {
    try {
      const res= await API.post('/cards', {
        name: card.name,
        type: card.type,
        rarity: card.rarity,
        value: card.value,
        description: card.description,
        status: 'wanted',
      });
      const newCard= res.data.data || res.data;
      setCards((prev) => [...prev, newCard]);
      notifySuccess('CARD_ADD_SUCCESS');
    } catch (err) {
      notifyError(err, 'CARD_ADD_ERROR');
    }
  };

  //edit a card
  /**
   * Enter edit mode for a selected card.
   * @param {object} card
   * @returns {void}
   */
  const handleEditCard= (card) => setEditingCard(card);

  /**
   * Update card state after a successful edit.
   * @param {{ _id: string }} updatedCard
   * @returns {void}
   */
  const handleSaveCard= (updatedCard) => {
    setCards((prev) => prev.map((c) => (c._id === updatedCard._id ? updatedCard : c)));
    setEditingCard(null);
  };

  /**
   * Exit edit mode without saving.
   * @returns {void}
   */
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
          <TradeAlertButton hasNewTrades={hasNewTrades}/>
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
          onMoveToTrade={handleMoveToTrade}
          onCancelTrade={handleCancelTrade}
          onAddWanted={handleAddWanted}
        />
      </CardPanel>
    </main>
  );
}
