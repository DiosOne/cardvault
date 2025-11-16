import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardList from '../components/CardList.jsx';
// import { type } from '@testing-library/user-event/dist/cjs/utility/type.js';

describe('CardList', () => {
  it('shows empty state when no cards exist', () => {
    render(<CardList cards={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/No cards yet/i)).toBeInTheDocument();
  });

  it('renders card details when data is provided', () => {
    const cards= [
      {_id: '1', name: 'Dark Magician', type: 'Spellcaster', rarity: 'Ultra Rare', value: 3000},
    ];
    render(<CardList cards={cards} onEdit={vi.fn()} onDelete={vi.fn()}/>);
    expect(screen.getByText(/Dark Magician/i)).toBeInTheDocument();
    expect(screen.getByText(/Spellcaster - Ultra Rare/i)).toBeInTheDocument();
  });

  it('calls onEdit and onDelete when buttons are clicked', async () => {
    const cards= [
      {_id: '1', name: 'Blue-Eyes', type: 'Dragon', rarity: 'Legendary', value: 5000},
    ];
    const handleEdit= vi.fn();
    const handleDelete= vi.fn();
    render(<CardList cards={cards} onEdit={handleEdit} onDelete={handleDelete}/>);

    await userEvent.click(screen.getByRole('button', {name: /edit blue-eyes/i}));
    await userEvent.click(screen.getByRole('button', {name: /delete blue-eyes/i}));

    expect(handleEdit).toHaveBeenCalledWith(cards[0]);
    expect(handleDelete).toHaveBeenCalledWith('1');
  });
});
