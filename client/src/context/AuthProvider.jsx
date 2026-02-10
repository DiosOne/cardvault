import { useState } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Read the persisted auth token from localStorage.
 * @returns {string|null}
 */
const getStoredToken= () => localStorage.getItem('token');

/**
 * Read the persisted user object from localStorage.
 * @returns {object|null}
 */
const getStoredUser= () => {
  const savedUser = localStorage.getItem('user');
  return savedUser ? JSON.parse(savedUser) : null;
};

/**
 * Provide authentication state and actions to descendant components.
 * @param {{ children: import('react').ReactNode }} props
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken);
  const [user, setUser] = useState(getStoredUser);

  /**
   * Persist user credentials after a successful login.
   * @param {{ user: object, token: string }} data
   * @returns {void}
   */
  const login= (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  /**
   * Clear user credentials and related local storage.
   * @returns {void}
   */
  const logout= () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tradeInboxSeenAt');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
