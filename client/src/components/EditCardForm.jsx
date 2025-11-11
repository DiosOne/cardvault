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
    <div className='edit-card-container'>
      <form onSubmit={handleSubmit} className='edit-card-form'>
        <h3>Edit Card</h3>
        <input
          name='name'
          type='text'
          value={formData.name}
          onChange={handleChange}
          placeholder='Card Name'
          required
        />

        <input
          name='type'
          type='text'
          value={formData.type}
          onChange={handleChange}
          placeholder='Type'
        />

        <input
          name='rarity'
          type='text'
          value= {formData.rarity}
          onChange={handleChange}
          placeholder='Rarity'
        />

        <input
          name='value'
          type='number'
          value={formData.value}
          onChange={handleChange}
          placeholder='Value'
        />

        <textarea
          name='description'
          value={formData.description}
          onChange={handleChange}
          placeholder='Description'
        />

        <select
          name='status'
          value={formData.status}
          onChange={handleChange}
        >
          <option value="owned">Owned</option>
          <option value="for trade">For Trade</option>
          <option value="wanted">Wanted</option>
        </select>

        <div className='form-buttons'>
          <button type='submit'>Save</button>
          <button type='button' onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}