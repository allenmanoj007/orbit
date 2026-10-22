import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Users', path: '/users', icon: '👥' },
    { name: 'Reports', path: '/reports', icon: '🚨' },
    { name: 'Interests & Hobbies', path: '/interests', icon: '🏷️' },
    { name: 'Moderation', path: '/content', icon: '🛡️' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <span className="text-2xl">🪐</span>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Orbit</h1>
              <p className="text-xs text-purple-400 font-semibold tracking-wider uppercase">
                Admin Center
              </p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              {admin?.displayName ? admin.displayName[0] : 'A'}
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">
                {admin?.displayName || 'Admin'}
              </p>
              <p className="text-xs text-slate-400 mt-1">{admin?.email || 'admin@orbit.app'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 text-sm font-medium transition"
            title="Log out"
          >
            ✕
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
