import { useState } from 'react';
import API from '../api/api';

export default function EditCardForm({card, onSave, onCancel}) {
  const [formData, setFormData] = useState({
    name: card.name || '',
    type: card.type || '',
    rarity: card.rarity || '',
    value: card.value || '',
    description: card.description || '',
    status: card.status || 'owned',
  });

  //form input updates
  const handleChange = (e) => {
    const {name,value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit= async (e) => {
    e.preventDefault();
    try {
      const res= await API.patch(`/cards/${card._id}`, formData);
      onSave(res.data.data); //pass updated card back
      alert('Card updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Edit failed!');
    }
  };

  return (
    <section
      className="edit-card-container"
      aria-labelledby="edit-card-heading"
      role="region"
    >
      <form
        onSubmit={handleSubmit}
        className="edit-card-form"
        aria-describedby="edit-card-instructions"
      >
        <h3 id="edit-card-heading">Edit Card</h3>
        <p id="edit-card-instructions" className="visually-hidden">
          Update card details and click Save to confirm changes.
        </p>

        <label htmlFor="edit-name" className="visually-hidden">
          Card name
        </label>
        <input
          id="edit-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Card Name"
          required
          aria-required="true"
        />

        <label htmlFor="edit-type" className="visually-hidden">
          Card type
        </label>
        <input
          id="edit-type"
          name="type"
          type="text"
          value={formData.type}
          onChange={handleChange}
          placeholder="Type"
        />

        <label htmlFor="edit-rarity" className="visually-hidden">
          Card rarity
        </label>
        <input
          id="edit-rarity"
          name="rarity"
          type="text"
          value={formData.rarity}
          onChange={handleChange}
          placeholder="Rarity"
        />

        <label htmlFor="edit-value" className="visually-hidden">
          Card value
        </label>
        <input
          id="edit-value"
          name="value"
          type="number"
          value={formData.value}
          onChange={handleChange}
          placeholder="Value"
          inputMode="numeric"
        />

        <label htmlFor="edit-description" className="visually-hidden">
          Description
        </label>
        <textarea
          id="edit-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows="3"
        />

        <label htmlFor="edit-status" className="visually-hidden">
          Card status
        </label>
        <select
          id="edit-status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          aria-label="Select card status"
        >
          <option value="owned">Owned</option>
          <option value="for trade">For Trade</option>
          <option value="wanted">Wanted</option>
        </select>

        <div className="form-buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}