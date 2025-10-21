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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CardList;
