import { useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { TradeContext } from '../context/TradeContext';
import { resolveApiError } from '../utility/messages';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const {fetchTrades} = useContext(TradeContext);
  const [error, setError] = useState('');
  const LOGIN_ERROR= 'Login error';
  const navigate= useNavigate();

  const handleSubmit= async (e) => {
    e.preventDefault();
    try {
      const res= await API.post('/auth/login', {email, password});
      login(res.data);
      fetchTrades();
      navigate('/dashboard');
    } catch (err) {
      setError(resolveApiError(err, LOGIN_ERROR));
    }
  };

  return (
    <main className="auth-container" role='main'>
      <form onSubmit={handleSubmit} aria-labelledby='login-heading'>
        <h2 id='login-heading'>Login</h2>

        {error && <p className="error" role="alert">{error}</p>}

        <label htmlFor='login-email' className='visually-hidden'>
          Email address
        </label>
        <input 
          id='login-email'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required='true'
        />

        <label htmlFor='login-password' className='visually-hidden'>
          Password
        </label>
        <input 
          id='login-password'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required='true'
        />

        <button type='submit'>Login</button>

        <p>
          Don't have an account?{' '}
          <NavLink to='/register' aria-label='Go to registration page'>
            Register Here
          </NavLink>
        </p>
      </form>
    </main>
  );
}
