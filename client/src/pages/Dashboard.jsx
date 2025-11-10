import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import CardForm from "./components/CardForm";
import CardList from "../components/CardList";
import {AuthContext} from "../context/AuthContext";

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {user, logout} = useContext(AuthContext);

  //fetch cards when page loads
  useEffect(() => {
    const fetchCards= async () => {
      try {
        const res = await API.get("/cards");
        setCards(res.data);
      } catch {
        setError("Failed to load your cards. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  //add new card
  const handleAddCard= async (cardData) => {
    try {
      const res= await API.post("/cards", cardData);
      const newCard= res.data;
      setCards([...cards, newCard]);
      alert("Card added successfully!");
    } catch {
      alert("Failed to add card!");
    }
  };

  //delete a card
  const handleDeleteCard= async (id) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    try {
      await API.delete(`/cards/${id}`);
      setCards(cards.filter((card) => card._id !== id));
      alert("Card deleted successfully!");
    } catch {
      alert("Delete failed!");
    }
  };

  //edit a card
  const handleEditCard= async (card) => {
    const newName= prompt("Enter new name:", card.name);
    if (!newName) return;
    try {
      const res= await API.patch(`/cards/${cards._id}`, {
        ...card,
        name: newName,
      });
      setCards(cards.map(c => c._id === card._id ? res.data : c));
      alert("Card updated successfully!");
    } catch {
      alert("Edit failed!");
    }
  };

  if (loading) return <p className="loading">Loading your cards...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {user?.username}!</h2>
        <button type="button" onClick={logout}>Logout</button>
      </div>
      <p>Your Cards</p>
      
      <CardForm onAdd={handleAddCard}/>
      <CardList cards={cards} onEdit={handleEditCard } onDelete={handleDeleteCard}/>
    </div>
  );

}
