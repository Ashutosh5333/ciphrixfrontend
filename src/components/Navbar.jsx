import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { openTaskModal } from "../features/ui/uiSlice";

export default function Navbar() {
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">
          Task Manager
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => document.documentElement.classList.toggle("dark")}
            className="px-3 py-1 rounded border dark:border-gray-600"
            title="Toggle theme"
          >
            Theme
          </button>

          {auth.user ? (
            <>
              <span className="text-sm hidden sm:inline">
                Hi, {auth.user.name} ({auth.user.role})
              </span>
              {/* <button onClick={() => navigate('/tasks/new')} className="px-3 py-1 bg-blue-600 text-white rounded">Add Task</button> */}
              <button
                onClick={() => dispatch(openTaskModal(null))}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Add Task
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="px-3 py-1 border rounded">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
