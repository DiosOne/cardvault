import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardList from '../components/CardList.jsx';
// import { type } from '@testing-library/user-event/dist/cjs/utility/type.js';

/**
 * Verify the empty state renders when no cards are present.
 * @returns {void}
 */
const shouldShowEmptyState = () => {
  render(
    <CardList
      cards={[]}
      onEdit={vi.fn()}
      onDelete={vi.fn()}
      onMoveToTrade={vi.fn()}
      onCancelTrade={vi.fn()}
      onAddWanted={vi.fn()}
    />,
  );
  expect(screen.getByText(/No cards yet/i)).toBeInTheDocument();
};

/**
 * Verify card details render when card data exists.
 * @returns {void}
 */
const shouldRenderCardDetails = () => {
  const cards= [
    {_id: '1', name: 'Dark Magician', type: 'Spellcaster', rarity: 'Ultra Rare', value: 3000, status: 'owned'},
  ];
  render(
    <CardList
      cards={cards}
      onEdit={vi.fn()}
      onDelete={vi.fn()}
      onMoveToTrade={vi.fn()}
      onCancelTrade={vi.fn()}
      onAddWanted={vi.fn()}
    />,
  );
  expect(screen.getByText(/Dark Magician/i)).toBeInTheDocument();
  expect(screen.getByText(/Spellcaster - Ultra Rare/i)).toBeInTheDocument();
};

/**
 * Verify edit and delete callbacks fire for owned cards.
 * @returns {Promise<void>}
 */
const shouldCallEditAndDelete = async () => {
  const cards= [
    {_id: '1', name: 'Blue-Eyes', type: 'Dragon', rarity: 'Legendary', value: 5000, status: 'owned'},
  ];
  const handleEdit= vi.fn();
  const handleDelete= vi.fn();
  render(
    <CardList
      cards={cards}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onMoveToTrade={vi.fn()}
      onCancelTrade={vi.fn()}
      onAddWanted={vi.fn()}
    />,
  );

  await userEvent.click(screen.getByRole('button', {name: /edit blue-eyes/i}));
  await userEvent.click(screen.getByRole('button', {name: /delete blue-eyes/i}));

  expect(handleEdit).toHaveBeenCalledWith(cards[0]);
  expect(handleDelete).toHaveBeenCalledWith('1');
};

/**
 * Verify cancel trade callbacks fire for trade-listed cards.
 * @returns {Promise<void>}
 */
const shouldCallCancelTradeForTradeCards = async () => {
  const cards= [
    {_id: '1', name: 'Red-Eyes', type: 'Dragon', rarity: 'Rare', value: 1200, status: 'for trade'},
  ];
  const handleCancelTrade= vi.fn();
  render(
    <CardList
      cards={cards}
      onEdit={vi.fn()}
      onDelete={vi.fn()}
      onMoveToTrade={vi.fn()}
      onCancelTrade={handleCancelTrade}
      onAddWanted={vi.fn()}
    />,
  );

  await userEvent.click(screen.getByRole('button', {name: /cancel trade for red-eyes/i}));

  expect(handleCancelTrade).toHaveBeenCalledWith(cards[0]);
};

/**
 * CardList test suite grouping.
 * @returns {void}
 */
const cardListSuite = () => {
  it('shows empty state when no cards exist', shouldShowEmptyState);
  it('renders card details when data is provided', shouldRenderCardDetails);
  it('calls onEdit and onDelete when buttons are clicked', shouldCallEditAndDelete);
  it('calls onCancelTrade when cancel is clicked for trade cards', shouldCallCancelTradeForTradeCards);
};

describe('CardList', cardListSuite);
