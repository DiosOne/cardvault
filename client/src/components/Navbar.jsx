import { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {Moon, Sun} from 'lucide-react';
import { TradeContext } from '../context/TradeContext';
import { MdNotificationsActive } from 'react-icons/md';
import {confirmAction} from '../utility/notifications';


export default function Navbar() {
  const {user, logout} = useContext(AuthContext);
  const navigate= useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const {hasNewTrades} = useContext(TradeContext);

  //darkmode + remember
  const toggleTheme= () => {
    const newMode= !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle('darkmode', newMode);
    localStorage.setItem('theme', newMode ? 'dark':'light');
  };
    
  //load theme on mount
  useEffect(() => {
    const savedTheme= localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('darkmode');
    }
  }, []);

  //handle logout and nav home
  const handleLogout= () => {
    if (!confirmAction('LOGOUT_CONFIRM')) return;
    logout();
    navigate('/login');
  };

  return (
    <header className='site-header'>
      <div className='brand-row'>
        <h1 className='brand-title'>
          <NavLink to='/' aria-label='Go to CardVault homepage'>
            CardVault
          </NavLink>
        </h1>
        <p className='brand-tagline'>Track, Trade, Treasure</p>
      </div>

      <nav className='navbar' role='navigation' aria-label='Main navigation'>
        <ul className='nav-right'>
          {user ? (
            <>
              <li>
                <NavLink to='/dashboard' aria-label='Go to your dashboard'>
                  Dashboard
                </NavLink>
              </li>

              <li>
                <NavLink to='/public' aria-label='See the cards up for trade'>
                  Public Trades
                </NavLink>
              </li>

              <li>
                <NavLink to='/trades' aria-label='Open trades inbox' className={({ isActive}) => (isActive ? 'active': undefined)}>
                  Trade Inbox {hasNewTrades && (<MdNotificationsActive className='trade-bell' aria-label='New trade requests'/>)}
                </NavLink>
              </li>
              
              <li>
                <button
                  type='button'
                  onClick={handleLogout}
                  aria-label='Log out of your account'
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to='/' aria-label='Go to homepage'>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to='/login' aria-label='Go to login page'>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to='/register' aria-label='Go to registration page'>
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink to='/public' aria-label='Browse public trades'>
                  Public Trades
                </NavLink>
              </li>
            </>
          )}

          <li>
            <button
              className='theme-toggle'
              type='button'
              onClick={toggleTheme}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
