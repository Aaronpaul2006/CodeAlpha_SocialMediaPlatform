import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Feed from './pages/Feed.jsx';
import Profile from './pages/Profile.jsx';
import PostDetail from './pages/PostDetail.jsx';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div>
        <Link to="/" className="navbar-brand">★ NET_SOCIAL ★</Link>
        <Link to="/">Feed</Link>
        {user && <Link to={`/profile/${user.id}`}>My Profile</Link>}
      </div>
      <div>
        {user ? (
          <button className="secondary" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}

function Ticker() {
  return (
    <div className="ticker-wrap">
      <div className="ticker">
        ⚡ Welcome to NET_SOCIAL! • Connect, share, and vibe in retro glass style • ⚡ Update your bio • ⚡ Follow friends to see their updates here! • ⚡
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Ticker />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Feed />
              </PrivateRoute>
            }
          />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </div>
    </>
  );
}
