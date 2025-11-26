import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Toast from "../components/Toast";
import { validate } from "../utils/validate";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
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

    if (loading) return;

    setLoading(true);
    try {
      await axios.post("/auth/signup", form);
      setToast("Account created! Redirecting...");
      setTimeout(() => navigate("/signin"), 1000);
    } catch (err) {
      setToast(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded p-6 shadow mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">Create Account</h2>

      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          icon={FiUser}
          value={form.name}
          onChange={onChange}
          error={errors.name}
        />

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

        <Button loading={loading}>Create Account</Button>
      </form>

      <Toast message={toast} clear={() => setToast("")} />
    </div>
  );
}

// import React, { useState } from 'react';
// import axios from '../api/axios';
// import { useNavigate } from 'react-router-dom';

// export default function SignUp() {
//   const [form, setForm] = useState({ name: '', email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const submit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.post('/auth/signup', form);
//       navigate('/signin');
//     } catch (err) {
//       alert(err?.response?.data?.message || 'Sign up failed');
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded p-6 shadow">
//       <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
//       <form onSubmit={submit} className="space-y-3">
//         <input name="name" value={form.name} onChange={handle} placeholder="Name" className="w-full px-3 py-2 border rounded bg-transparent" />
//         <input name="email" value={form.email} onChange={handle} placeholder="Email" type="email" className="w-full px-3 py-2 border rounded bg-transparent" />
//         <input name="password" value={form.password} onChange={handle} placeholder="Password" type="password" className="w-full px-3 py-2 border rounded bg-transparent" />
//         <button disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded">{loading ? 'Creating...' : 'Create account'}</button>
//       </form>
//     </div>
//   );
// }
