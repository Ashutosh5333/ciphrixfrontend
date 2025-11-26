import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => !!document.documentElement.classList.contains('dark'));
  useEffect(() => { if (dark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [dark]);
  const handleLogout = () => { signout(); navigate('/signin'); };
  return (
    <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">Task Manager</Link>
        <div className="flex items-center gap-4">
          <button onClick={() => setDark(d => !d)} className="px-3 py-1 rounded border dark:border-gray-600" title="Toggle theme">
            {dark ? 'Light' : 'Dark'}
          </button>
          {user ? (
            <>
              <span className="text-sm hidden sm:inline">Hi, {user.name} ({user.role})</span>
              <button onClick={() => navigate('/tasks/new')} className="px-3 py-1 bg-blue-600 text-white rounded">Add Task</button>
              <button onClick={handleLogout} className="px-3 py-1 border rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin" className="px-3 py-1 border rounded">Sign In</Link>
              <Link to="/signup" className="px-3 py-1 bg-blue-600 text-white rounded">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
