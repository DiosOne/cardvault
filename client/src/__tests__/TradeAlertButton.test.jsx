import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

/**
 * Mock NavLink to render its children directly.
 * @param {{ children: import('react').ReactNode }} props
 * @returns {JSX.Element}
 */
const MockNavLink = ({ children }) => <div>{children}</div>;

vi.mock('react-router-dom', () => ({
  NavLink: MockNavLink,
}));

/**
 * Mock notification icon for predictable rendering.
 * @returns {JSX.Element}
 */
const MockNotificationsIcon = () => <span aria-label='New trade requests'>Bell</span>;

vi.mock('react-icons/md', () => ({
  MdNotificationsActive: MockNotificationsIcon,
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
