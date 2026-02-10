import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-router-dom', () => ({
  NavLink: ({ children }) => <div>{children}</div>,
}));

vi.mock('react-icons/md', () => ({
  MdNotificationsActive: () => <span aria-label='New trade requests'>Bell</span>,
}));

import TradeAlertButton from '../components/TradeAlertButton';

/**
 * Verify the alert state renders when new trades exist.
 * @returns {void}
 */
const shouldRenderAlertState = () => {
  render(<TradeAlertButton hasNewTrades />);
  expect(screen.getByText(/view trade inbox/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/new trade requests/i)).toBeInTheDocument();
};

/**
 * Verify the default CTA renders when no trades are new.
 * @returns {void}
 */
const shouldRenderDefaultCta = () => {
  render(<TradeAlertButton hasNewTrades={false} />);
  expect(screen.getByText(/go to trade inbox/i)).toBeInTheDocument();
  expect(screen.queryByLabelText(/new trade requests/i)).toBeNull();
};

/**
 * TradeAlertButton test suite grouping.
 * @returns {void}
 */
const tradeAlertButtonSuite = () => {
  it('renders alert state when there are new trades', shouldRenderAlertState);
  it('renders default CTA when there are no new trades', shouldRenderDefaultCta);
};

describe('TradeAlertButton', tradeAlertButtonSuite);
