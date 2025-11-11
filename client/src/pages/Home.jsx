import { NavLink } from 'react-router-dom';

export default function Home() {
  return (
    <main className="home" role='main'>
      <header className="hero" aria-labelledby='site-title'>
        <h1 id='site-title'>CardVault</h1>
        <p>Store and manage your <strong>card collection</strong> in one secure place.</p>
        <nav className="hero-actions" aria-label='Primary navigation'>
          <NavLink className="btn primary" to="/register" aria-label='Create a CardVault account'>
            Create Account
          </NavLink>
          <NavLink className="btn secondary" to="/login" aria-label='Log in to CardVault'>
            Log In
          </NavLink>
        </nav>
      </header>      
    </main>
  );
}
