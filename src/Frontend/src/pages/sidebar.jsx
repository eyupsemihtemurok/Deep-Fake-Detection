import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">MENÜ</h2>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link className="sidebar-link" to="/">Video Analiz</Link>
        </li>
        <li className="sidebar-item">
          <Link className="sidebar-link" to="/history">Geçmiş Analizler</Link>
        </li>
        <li className="sidebar-item">
          <Link className="sidebar-link" to="/about">Hakkında</Link>
        </li>
        <li className="sidebar-item">
          <Link className="sidebar-link" to="/twitter">Twitter Examples</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
