import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { FiMail, FiLock } from 'react-icons/fi';

export default function SignIn() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (auth.user) navigate('/');
  }, [auth.user, navigate]);

  useEffect(() => {
    if (auth.error) setToast(auth.error);
  }, [auth.error]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setToast('Please enter email and password');
      return;
    }
    dispatch(loginUser(form));
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded p-6 shadow mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">Sign In</h2>
      <form onSubmit={submit} className="space-y-3">
        <Input name="email" value={form.email} onChange={handle} placeholder="Email" icon={FiMail} />
        <Input name="password" type="password" value={form.password} onChange={handle} placeholder="Password" icon={FiLock} />
        <Button loading={auth.loading}>{auth.loading ? 'Signing...' : 'Sign in'}</Button>
      </form>

      <div className="mt-4 text-sm text-center">
        Don't have an account? <Link to="/signup" className="text-blue-600">Sign up</Link>
      </div>

      <Toast message={toast} clear={() => setToast('')} />
    </div>
  );
}