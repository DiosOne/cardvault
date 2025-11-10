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
    <nav className="navbar">
      <div className="nav-left">
        <h1>CardVault</h1>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode? <Sun size={18}/>:<Moon size={18}/>}
        </button>
      </div>
    </nav>
  );
}