import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PublicTrades from '../pages/PublicTrades';
import { AuthContext } from '../context/AuthContext';
import { TradeContext } from '../context/TradeContext';
import API from '../api/api';

vi.mock('../api/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

const renderPublicTrades = ({ user }) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user }}>
        <TradeContext.Provider value={{ fetchTrades: vi.fn() }}>
          <PublicTrades />
        </TradeContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  );

describe.skip('PublicTrades', () => {
  it('surfaces fetch errors (skipped pending router fix)', async () => {
    API.get.mockRejectedValue(new Error('server down'));

    renderPublicTrades({ user: { _id: 'user-1' } });

    await waitFor(() =>
      expect(
        screen.getByText(/Failed to load public trade cards/i),
      ).toBeInTheDocument(),
    );
  });

  it('renders login prompt when no user is present (skipped)', async () => {
    API.get.mockResolvedValue({ data: { data: [] } });

    renderPublicTrades({ user: null });

    expect(await screen.findByText(/sign in or create an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });
});
