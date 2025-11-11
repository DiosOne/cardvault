import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {Moon, Sun} from 'lucide-react';

export default function Navbar() {
  const {user, logout} = useContext(AuthContext);
  const navigate= useNavigate();
  const [darkMode, setDarkMode] = useState(false);

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
    logout();
    navigate('/login');
  };

  return (
    <header>
      <nav className='navbar' role='navigation' aria-label='Main navigation'>
        <div className='nav-list'>
          <h1>
            <Link to='/' aria-label='Go to CardVault homepage'>
              CardVault
            </Link>
          </h1>
        </div>

        <ul className='nav-right'>
          {user ? (
            <>
              <li>
                <Link to='/dashboard' aria-label='Go to your dashboard'>
                  Dashboard
                </Link>
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
                <Link to='/' aria-label='Go to homepage'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/login' aria-label='Go to login page'>
                  Login
                </Link>
              </li>
              <li>
                <Link to='/register' aria-label='Go to registration page'>
                  Register
                </Link>
              </li>
              <li>
                <Link to='/public' aria-label='Browse public trades'>
                  Public Trades
                </Link>
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
