import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../redux/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logoutSuccess());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow px-8 py-4 mb-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
        📝 Task Manager
      </Link>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
