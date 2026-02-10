import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import PublicTrades from './pages/PublicTrades';
import TradeInbox from './pages/TradeInbox';

/**
 * Configure the primary application routes and layout.
 * @returns {JSX.Element}
 */
export default function App() {
  const {user}= useContext(AuthContext);

  return (
    <Router>
      <Navbar/>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/public" element={<PublicTrades />}/>
        {/* protected routes */}
        <Route path="/dashboard" element={user? <Dashboard/> : <Navigate to="/login" replace/>}/>
        <Route path='/trades' element={user ? <TradeInbox/>: <Navigate to='/login' replace/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}
