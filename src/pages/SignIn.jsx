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

    if (loading) return; 
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

