import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

export default function SignUp() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (auth.error) setToast(auth.error);
  }, [auth.error]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setToast('Please fill all fields');
      return;
    }
    dispatch(signupUser(form)).then((res) => {
      if (!res.error) navigate('/signin');
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded p-6 shadow mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>
      <form onSubmit={submit} className="space-y-3">
        <Input name="name" value={form.name} onChange={handle} placeholder="Full name" icon={FiUser} />
        <Input name="email" value={form.email} onChange={handle} placeholder="Email" icon={FiMail} />
        <Input name="password" type="password" value={form.password} onChange={handle} placeholder="Password" icon={FiLock} />
        <Button loading={auth.loading}>{auth.loading ? 'Creating...' : 'Create account'}</Button>
      </form>

      <div className="mt-4 text-sm text-center">
        Already have an account? <Link to="/signin" className="text-blue-600">Sign in</Link>
      </div>

      <Toast message={toast} clear={() => setToast('')} />
    </div>
  );
}

