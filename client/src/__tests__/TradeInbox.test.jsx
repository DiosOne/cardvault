import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TradeInbox from '../pages/TradeInbox';
import { AuthContext } from '../context/AuthContext';
import { TradeContext } from '../context/TradeContext';

vi.mock('../utility/notifications', () => ({
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
}));

const renderInbox = (tradeContextValue) =>
  render(
    <AuthContext.Provider value={{ user: { _id: 'user-1' } }}>
      <TradeContext.Provider value={tradeContextValue}>
        <TradeInbox />
      </TradeContext.Provider>
    </AuthContext.Provider>,
  );

describe('TradeInbox', () => {
  it('shows empty state when there are no trades', () => {
    renderInbox({
      trades: [],
      fetchTrades: vi.fn(),
      clearNotifications: vi.fn(),
      respondToTrade: vi.fn(),
    });

    expect(screen.getByText(/No trade activity yet/i)).toBeInTheDocument();
  });

  it('renders an incoming trade card', () => {
    renderInbox({
      trades: [
        {
          _id: 'trade-1',
          toUser: { _id: 'user-1', username: 'Ash' },
          fromUser: { _id: 'user-2', username: 'Gary' },
          cardId: { name: 'Charizard' },
          status: 'pending',
          message: 'Interested in trading?',
          createdAt: new Date().toISOString(),
        },
      ],
      fetchTrades: vi.fn(),
      clearNotifications: vi.fn(),
      respondToTrade: vi.fn(),
    });

    expect(screen.getByText(/Charizard/i)).toBeInTheDocument();
    expect(screen.getByText(/Interested in trading\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reply message/i)).toBeInTheDocument();
  });
});
