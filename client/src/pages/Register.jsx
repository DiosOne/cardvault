import { useState } from 'react';
import API from '../api/api';
import { useNavigate, NavLink } from 'react-router-dom';
import { resolveApiError } from '../utility/messages';
import { notifySuccess, notifyError } from '../utility/notifications';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('') ;
  const navigate= useNavigate();

  const handleSubmit= async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', {
        username,
        email,
        password,
      });
      notifySuccess('REGISTER_SUCCESS');
      setError('');
      navigate('/login');
    } catch (err) {
      const friendlyMessage= resolveApiError(err, 'REGISTER_ERROR');
      setError(friendlyMessage);
      notifyError(err, 'REGISTER_ERROR');
    }
  };

  return (
    <main className='auth-container' role='main'>
      <form onSubmit={handleSubmit} aria-labelledby='register-heading'>
        <h2 id='register-heading'>Create Account</h2>

        {error && <p className='error' role='alert'>(error)</p>}

        <label htmlFor='reg-username' className='visually-hidden'>
          Username
        </label>
        <input 
          id='reg-username'
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          aria-required='true'
        />

        <label htmlFor='reg-email' className='visually-hidden'>
          Email address
        </label>
        <input
          id='reg-email'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required='true'
        />

        <label htmlFor='reg-password' className='visually-hidden'>
          Password
        </label>
        <input
          id='reg-password'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required='true'
        />

        <button type="submit">Register</button>

        <p>
          Already have an account?{' '} 
          <NavLink to="/login" aria-label='Go to login page'>
            Log in here
          </NavLink>
        </p>            
      </form>
    </main>
  );
}
