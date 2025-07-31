import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import './SidebarLayout.css';
import { getAllowedPanels } from '../utils/rolePanels';

function SidebarLayout({ onLogout, username, role, children }) {
  const { user, logout } = useAuthContext();
  const AllowedPanels = getAllowedPanels(user.role);
  const [activePanel, setActivePanel] = useState('files');

  useEffect(() => {
    if (user.role === 'admin') {
      document.body.classList.add('dark');
    }
    return () => {
      document.body.classList.remove('dark');
    };
  }, [user.role]);

  return (
    <div className="sidebar-container">
      <div className={`sidebar ${user.role}`}>
        <aside className="sidebar">
          <h2>Welcome, {user.username || 'User'}</h2>
          <p>Role: {user.role}</p>
          <nav>
            <ul>
              <li
                className={activePanel === 'files' ? 'active-link' : ''}
                onClick={() => setActivePanel('files')}
              >
                Files
              </li>
              <li
                className={activePanel === 'alerts' ? 'active-link' : ''}
                onClick={() => setActivePanel('alerts')}
              >
                Alerts
              </li>
              <li
                className={activePanel === 'logs' ? 'active-link' : ''}
                onClick={() => setActivePanel('logs')}
              >
                Logs
              </li>
              <li
                className={activePanel === 'visuals' ? 'active-link' : ''}
                onClick={() => setActivePanel('visuals')}
              >
                Visuals
              </li>
              <li
                className={activePanel === 'ledger' ? 'active-link' : ''}
                onClick={() => setActivePanel('ledger')}
              >
                Ledger
              </li>
              <li onClick={logout}>Logout</li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          {typeof children === 'function' ? children(activePanel) : children}
        </main>
      </div>
    </div>
  );
}

export default SidebarLayout;
