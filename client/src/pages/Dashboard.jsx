import { useEffect, useState } from "react";
import API from "../api/api";
import CardForm from "./components/CardForm";
import CardList from "../components/CardList";

export default function Dashboard() {
  const [cards, setCards] = useState([]);

  //fetch cards when page loads
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await API.get("/cards");
        setCards(res.data);
      } catch (err) {
        console.error("Error fetching cards:", err);
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
    } catch (err) {
      console.error("Error adding card:", err);
    }
  };

  //delete a card
  const handleDeleteCard= async (id) => {
    try {
      await API.delete(`/cards/${id}`);
      setCards(cards.filter((card) => card._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
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
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  return (
    <div>
      <h2>Your Cards</h2>
      <CardForm onAdd={handleAddCard}/>
      <CardList cards={cards} onEdit={handleEditCard } onDelete={handleDeleteCard}/>
    </div>
  );

}