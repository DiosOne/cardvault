import { NavLink } from 'react-router-dom';
import { MdNotificationsActive } from 'react-icons/md';

export default function TradeAlertButton({hasNewTrades}) {
  return (
    <NavLink to={'/trades'} className={`btn secondary ${hasNewTrades ? 'dashboard-alert' : ''}`}>
      {hasNewTrades && <MdNotificationsActive className='trade-bell' aria-label="New trade requests" />}
      <span>{hasNewTrades ? 'View Trade Inbox' : 'Go to Trade Inbox'}</span>
    </NavLink>
  );
}
