import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import '../styles/sidebar.css';

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini kontrol et
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">MENÜ</h2>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link className="sidebar-link" to="/">Video Analiz</Link>
        </li>
        <li className="sidebar-item">
          <Link className="sidebar-link" to="/video-library">Video Kütüphanesi</Link>
        </li>
        <li className="sidebar-item">
          <Link className="sidebar-link" to="/hakkımızda">Hakkında</Link>
        </li>
        <li className="sidebar-item">
          <Link className="sidebar-link" to="/twitter">Twitter Examples</Link>
        </li>
      </ul>

      {/* Kullanıcı Profili Bölümü */}
      <div className="user-profile">
        {isLoggedIn ? (
          <div className="profile-info">
            <div className="profile-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="profile-name">{user?.username || 'Kullanıcı'}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => setShowAuthModal(true)}>
            <span className="login-icon">👤</span>
            Giriş Yap / Kayıt Ol
          </button>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default Sidebar;
