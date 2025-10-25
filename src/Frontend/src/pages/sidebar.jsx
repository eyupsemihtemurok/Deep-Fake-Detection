import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsMobileOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const menuItems = [
    { path: '/', label: 'Video Analiz', icon: '▶️' },
    { path: '/history', label: 'Geçmiş Analizler', icon: '📊' },
    { path: '/about', label: 'Hakkında', icon: 'ℹ️' },
    { path: '/twitter', label: 'Twitter', icon: '🐦' },
    { path: '/hakımızda', label: 'hakkımızda', icon: ':)' }
  ];

  return (
    <>
      {/* Mobil Overlay */}
      {isMobile && isMobileOpen && (
        <div className="sidebar-overlay" onClick={closeMobileSidebar} />
      )}
      
      {/* Mobil Toggle Butonu */}
      {isMobile && (
        <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      )}

      {/* Sidebar */}
      <div className={`
        sidebar 
        ${isCollapsed ? 'collapsed' : ''}
        ${isMobile ? 'mobile' : ''}
        ${isMobileOpen ? 'mobile-open' : ''}
      `}>
        
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">A</div>
            {!isCollapsed && (
              <div className="logo-text">
                <span className="brand">Analiz</span>
                <span className="pro">PRO</span>
              </div>
            )}
          </div>
          
          {!isMobile && (
            <button className="collapse-btn" onClick={toggleSidebar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={closeMobileSidebar}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="nav-label">{item.label}</span>
                  )}
                  {location.pathname === item.path && !isCollapsed && (
                    <div className="active-dot"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">
              <div className="avatar">K</div>
              <div className="status"></div>
            </div>
            {!isCollapsed && (
              <div className="user-info">
                <p className="username">Kerem Aydın</p>
                <p className="userplan">Premium Üye</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;