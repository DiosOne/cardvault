import React, { useEffect, useState } from "react";
import axios from "axios";
import CardForm from "./CardForm";

const CardList = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Fetch cards when component mounts
    const fetchCards = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cards");
        console.log("Fetched Cards:", res.data);
        setCards(res.data);
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    };
    fetchCards();
  }, []);

  // Handler to add a new card from the form
  const handleAddCard = (newCard) => {
    setCards([...cards, newCard]);
  };

  // Delete a card
const handleDeleteCard = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/cards/${id}`);
    setCards(cards.filter((card) => card._id !== id));
  } catch (err) {
    console.error(err);
  }
};

// Edit a card (simplest: prompt for new name)
const handleEditCard = async (card) => {
  const newName = prompt("Enter new name:", card.name);
  if (!newName) return;

  try {
    const res = await axios.patch(`http://localhost:5000/api/cards/${card._id}`, {
      ...card,
      name: newName,
    });
    setCards(cards.map(c => c._id === card._id ? res.data : c));
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div>
      <h2>CardVault</h2>

      <CardForm onAdd={handleAddCard} />

      {cards.length === 0 ? (
        <p>No cards yet</p>
      ) : (
        <ul>
  {cards.map((card) => (
    <li key={card._id}>
      <strong>{card.name}</strong> ({card.type}) - {card.rarity} - ${card.value}
      <button onClick={() => handleEditCard(card)}>Edit</button>
      <button onClick={() => handleDeleteCard(card._id)}>Delete</button>
    </li>
  ))}
</ul>

      )}
    </div>
  );
};

export default CardList;
