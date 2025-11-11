import { useState } from 'react';

export default function CardForm({onAdd}) {
  const [form, setForm] = useState({
    name: '',
    type: '',
    rarity: '',
    value: '',
    status: 'owned',
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
    <section aria-labelledby="add-card-heading">
      <h3 id="add-card-heading" className="visually-hidden">
        Add a new card to your collection
      </h3>

      <form onSubmit={handleSubmit} aria-describedby="form-instructions">
        <p id="form-instructions" className="visually-hidden">
          Enter card details and choose its status, then click Add Card.
        </p>

        <label htmlFor="card-name" className="visually-hidden">
          Card Name
        </label>
        <input
          id="card-name"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          aria-required="true"
        />

        <label htmlFor="card-type" className="visually-hidden">
          Card Type
        </label>
        <input
          id="card-type"
          name="type"
          placeholder="Type"
          value={form.type}
          onChange={handleChange}
          required
          aria-required="true"
        />

        <label htmlFor="card-rarity" className="visually-hidden">
          Card Rarity
        </label>
        <input
          id="card-rarity"
          name="rarity"
          placeholder="Rarity"
          value={form.rarity}
          onChange={handleChange}
          required
          aria-required="true"
        />

        <label htmlFor="card-value" className="visually-hidden">
          Card Value
        </label>
        <input
          id="card-value"
          name="value"
          placeholder="Value"
          value={form.value}
          onChange={handleChange}
          required
          aria-required="true"
          inputMode="numeric"
        />

        <label htmlFor="card-status" className="visually-hidden">
          Card Status
        </label>
        <select
          id="card-status"
          name="status"
          value={form.status}
          onChange={handleChange}
          aria-label="Select card status"
        >
          <option value="owned">Owned</option>
          <option value="for trade">For Trade</option>
          <option value="wanted">Wanted</option>
        </select>

        <button type="submit">Add Card</button>
      </form>
    </section>
  );
}