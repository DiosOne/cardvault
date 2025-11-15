import { useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { TradeContext } from '../context/TradeContext';
import { resolveApiError } from '../utility/messages';
import { notifySuccess, notifyError } from '../utility/notifications';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const {fetchTrades} = useContext(TradeContext);
  const [error, setError] = useState('');
  const navigate= useNavigate();

  const handleSubmit= async (e) => {
    e.preventDefault();
    try {
      const res= await API.post('/auth/login', {email, password});
      login(res.data);
      notifySuccess('LOGIN_SUCCESS');
      fetchTrades();
      navigate('/dashboard');
    } catch (err) {
      const friendlyMessage= resolveApiError(err, 'LOGIN_ERROR');
      setError(friendlyMessage);
      notifyError(err, 'LOGIN_ERROR');
    }
  };

  return (
    <AuthLayout
      title='Login'
      subtitle='Access your CardVault account'
      onSubmit={handleSubmit}
    >
      {error && <p className='error' role='alert'>{error}</p>}
      
      
      <label htmlFor="login-email" className="visually-hidden">
        Email address
      </label>
      <input
        id="login-email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        aria-required="true"
      />

      <label htmlFor="login-password" className="visually-hidden">
        Password
      </label>
      <input
        id="login-password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        aria-required="true"
      />

      <button type="submit">Login</button>

      <p>
        Don't have an account?{' '}
        <NavLink to="/register" aria-label="Go to registration page">
          Register Here
        </NavLink>
      </p>
    </AuthLayout>
  );
}