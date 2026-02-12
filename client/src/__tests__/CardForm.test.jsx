import { describe, it, expect, vi } from 'vitest';
import { render, screen} from '@testing-library/react';
import userEvent from'@testing-library/user-event';
import CardForm from '../components/CardForm';

/**
 * Verify the CardForm submits user input via the onAdd callback.
 * @returns {Promise<void>}
 */
const shouldSubmitUserInput= async () => {
  const handleAdd= vi.fn();
  render(<CardForm onAdd={handleAdd} />);

  await userEvent.type(screen.getByLabelText(/card name/i), 'Blue-Eyes White Dragon');
  await userEvent.type(screen.getByLabelText(/card type/i), 'Dragon');
  await userEvent.type(screen.getByLabelText(/card rarity/i), 'Ultra Rare');
  await userEvent.type(screen.getByLabelText(/card value/i), '5000');
  await userEvent.selectOptions(screen.getByLabelText(/card status/i), ['Wanted']);

  await userEvent.click(screen.getByRole('button', {name: /add card/i}));

  expect(handleAdd).toHaveBeenCalledWith({
    name: 'Blue-Eyes White Dragon',
    type: 'Dragon',
    rarity: 'Ultra Rare',
    value: 5000,
    status: 'wanted',
  });
};

/**
 * CardForm test suite grouping.
 * @returns {void}
 */
const cardFormSuite= () => {
  it('submits user input via onAdd', shouldSubmitUserInput);
};

describe('CardForm', cardFormSuite);
