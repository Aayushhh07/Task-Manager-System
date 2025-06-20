import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow px-4 py-2 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl text-blue-700">Task Manager</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700">{user.name} ({user.role})</span>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 