import React, { useState } from "react";
import axios from "axios";

const CardForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [rarity, setRarity] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/cards", {
        name,
        type,
        rarity,
        value: Number(value),
      });
      onAdd(res.data); // pass new card to parent
      setName(""); setType(""); setRarity(""); setValue("");
    } catch (err) {
      console.error("Error adding card:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Rarity"
        value={rarity}
        onChange={(e) => setRarity(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <button type="submit">Add Card</button>
    </form>
  );
};

export default CardForm;
