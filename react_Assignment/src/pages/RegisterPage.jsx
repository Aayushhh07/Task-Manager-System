import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUserThunk } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUserThunk(form));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full" required />
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full" required />
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full" required />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? <Loader /> : 'Register'}</button>
      </form>
      <div className="mt-4 text-sm">Already have an account? <Link to="/login" className="text-blue-600 underline">Login</Link></div>
    </div>
  );
};

export default RegisterPage; 