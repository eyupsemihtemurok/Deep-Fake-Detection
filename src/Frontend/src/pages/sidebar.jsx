import React from 'react';
import '../styles/sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Menü</h2>
      <ul className="sidebar-menu">
        <li className="sidebar-item">Ana Sayfa</li>
        <li className="sidebar-item">Geçmiş Analizler</li>
        <li className="sidebar-item">Ayarlar</li>
        <li className="sidebar-item">Hakkında</li>
      </ul>
    </div>
  );
};

export default Sidebar;
