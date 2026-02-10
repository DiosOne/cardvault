import { useState } from 'react';
import Section from './Section';

/**
 * Form for creating a new card entry.
 * @param {{ onAdd: (card: { name: string, type: string, rarity: string, value: number, status: string }) => void }} props
 * @returns {JSX.Element}
 */
export default function CardForm({onAdd}) {
  const [form, setForm] = useState({
    name: '',
    type: '',
    rarity: '',
    value: '',
    status: 'owned',
  });

  /**
   * Update form state on input changes.
   * @param {import('react').ChangeEvent<HTMLInputElement|HTMLSelectElement>} e
   * @returns {void}
   */
  const handleChange= (e) =>
    setForm({...form, [e.target.name]: e.target.value});

  /**
   * Submit a new card to the parent handler.
   * @param {import('react').FormEvent<HTMLFormElement>} e
   * @returns {void}
   */
  const handleSubmit= (e) => {
    e.preventDefault();
    onAdd({
      name: form.name,
      type: form.type,
      rarity: form.rarity,
      value: Number(form.value),
      status: form.status,
    });
    setForm({name: '', type: '', rarity: '', value: ''});
  };

  return (
    <Section
      title="Add a new card to your collection"
      className="card-form"
      role="region"
      live="polite"
    >
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
    </Section>
  );
}
