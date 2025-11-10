import { useState } from 'react';

export default function CardForm({onAdd}) {
  const [form, setForm] = useState({
    name: '',
    type: '',
    rarity: '',
    value: '',    
  });

  const handleChange= (e) =>
    setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit= (e) => {
    e.preventDefault();
    onAdd({
      name: form.name,
      type: form.type,
      rarity: form.rarity,
      value: Number(form.value),
    });
    setForm({name: '', type: '', rarity: '', value: ''});
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required/>
      <input name="type" placeholder="Type" value={form.type} onChange={handleChange} required/>
      <input name="rarity" placeholder="Rarity" value={form.rarity} onChange={handleChange} required/>
      <input name="value" placeholder="Value" value={form.value}  onChange={handleChange} required/>
      <button type="submit">Add Card</button>
    </form>
  );
}