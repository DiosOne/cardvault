import React, { useEffect, useState } from "react";
import axios from "axios";
import CardForm from "./CardForm";

const CardList= () => {
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
  const handleAddCard= (newCard) => {
    setCards([...cards, newCard]);
  };

  // Delete a card
const handleDeleteCard= async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/cards/${id}`);
    setCards(cards.filter((card) => card._id !== id));
  } catch (err) {
    console.error(err);
  }
};

// Edit a card
const handleEditCard= async (card) => {
  const newName= prompt("Enter new name:", card.name);
  if (!newName) return;

  try {
    const res= await axios.patch(`http://localhost:5000/api/cards/${card._id}`, {
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
        <button className="theme-toggle" onClick={() => document.body.classList.toggle("dark-mode")}
>   Toggle Dark Mode
    </button>

      <h2>CardVault</h2>

      <CardForm onAdd={handleAddCard} />

      {cards.length === 0 ? (
        <p>No cards yet</p>
      ) : (
        <div className="card-grid">
        {cards.map((card) => (
          <div className="card" key={card._id}>
            <img
              src="https://via.placeholder.com/300x180"
              alt={card.name || "Card placeholder"}
              className="card-image"
            />
            <h3>{card.name}</h3>
            <p>{card.type} — {card.rarity}</p>
            <p>${card.value}</p>
            <button onClick={() => handleEditCard(card)}>Edit</button>
            <button onClick={() => handleDeleteCard(card._id)}>Delete</button>
          </div>
        ))}
      </div>

      )}
    </div>
  );
};

export default CardList;
