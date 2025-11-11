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
        {/* protected route */}
        <Route path="/dashboard" element={user? <Dashboard/> : <Navigate to="/login" replace/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}
