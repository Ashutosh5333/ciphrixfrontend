import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import Toast from "../components/Toast";
import { validate } from "../utils/validate";
import { FiMail, FiLock } from "react-icons/fi";

export default function SignIn() {
  const { signin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    if (loading) return; // prevent double click

    setLoading(true);
    try {
      const res = await axios.post("/auth/signin", form);
      signin(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setToast(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded p-6 shadow mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">Welcome Back</h2>

      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          icon={FiMail}
          value={form.email}
          onChange={onChange}
          error={errors.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          icon={FiLock}
          value={form.password}
          onChange={onChange}
          error={errors.password}
        />

        <Button loading={loading}>Login</Button>
      </form>

      <Toast message={toast} clear={() => setToast("")} />
    </div>
  );
}


// import React, { useState } from 'react';
// import axios from '../api/axios';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// export default function SignIn() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { signin } = useAuth();

//   const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const submit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const { data } = await axios.post('/auth/signin', form);
//       signin(data.user, data.token);
//       navigate('/');
//     } catch (err) {
//       alert(err?.response?.data?.message || 'Sign in failed');
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded p-6 shadow">
//       <h2 className="text-xl font-semibold mb-4">Sign In</h2>
//       <form onSubmit={submit} className="space-y-3">
//         <input name="email" value={form.email} onChange={handle} placeholder="Email" type="email" className="w-full px-3 py-2 border rounded bg-transparent" />
//         <input name="password" value={form.password} onChange={handle} placeholder="Password" type="password" className="w-full px-3 py-2 border rounded bg-transparent" />
//         <button disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded">{loading ? 'Signing...' : 'Sign in'}</button>
//       </form>
//     </div>
//   );
// }
