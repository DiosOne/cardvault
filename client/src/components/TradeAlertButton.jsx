import { NavLink } from 'react-router-dom';
import { MdNotificationsActive } from 'react-icons/md';

/**
 * Button link that highlights when new trades are available.
 * @param {{ hasNewTrades: boolean }} props
 * @returns {JSX.Element}
 */
export default function TradeAlertButton({hasNewTrades}) {
  return (
    <NavLink to={'/trades'} className={`btn secondary ${hasNewTrades ? 'dashboard-alert' : ''}`}>
      {hasNewTrades && <MdNotificationsActive className='trade-bell' aria-label="New trade requests" />}
      <span>{hasNewTrades ? 'View Trade Inbox' : 'Go to Trade Inbox'}</span>
    </NavLink>
  );
}
