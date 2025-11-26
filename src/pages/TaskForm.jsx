import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import TaskTitleInput from "../components/task/TaskTitleInput";
import TaskDescriptionInput from "../components/task/TaskDescriptionInput";
import TaskStatusSelector from "../components/task/TaskStatusSelector";
import TaskFormActions from "../components/task/TaskFormActions";
import Toast from "../components/Toast";
import { FiEdit3 } from "react-icons/fi";

export default function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit); 
  const [toast, setToast] = useState("");

  // Validations
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  };

  // Load task for editing WITHOUT blocking UI
  useEffect(() => {
    if (!isEdit) return;

    let timeout = setTimeout(() => setFetching(true), 10); // zero-block

    axios
      .get(`/tasks/${id}`)
      .then((res) => {
        setForm({
          title: res.data.title,
          description: res.data.description,
          status: res.data.status,
        });
      })
      .catch(() => setToast("Could not load task"))
      .finally(() => {
        clearTimeout(timeout);
        setFetching(false);
      });
  }, [id]);

  // Change handler
  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Submit handler
  const submit = async (e) => {
    e.preventDefault();
  
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;
  
    if (loading) return;
  
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/tasks/${id}`, form);
        setToast("Task updated");
      } else {
        await axios.post("/tasks", form);
        setToast("Task created");
      }
  
      navigate("/");  
    } catch (err) {
      setToast(err?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="p-8 rounded-3xl shadow-xl border bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl">

        <h2 className="text-3xl font-bold mb-7 flex items-center gap-3">
          <FiEdit3 className="text-blue-600" size={26} />
          {isEdit ? "Edit Task" : "Add New Task"}
        </h2>

        {/* Fast form (no delays) */}
        <form onSubmit={submit} className="space-y-6">

          <TaskTitleInput
            value={form.title}
            onChange={onChange}
            error={errors.title}
            disabled={fetching}
          />

          <TaskDescriptionInput
            value={form.description}
            onChange={onChange}
            error={errors.description}
            disabled={fetching}
          />

          <TaskStatusSelector
            value={form.status}
            setValue={(val) => setForm({ ...form, status: val })}
            disabled={fetching}
          />

          <TaskFormActions
            isEdit={isEdit}
            loading={loading}
            onCancel={() => navigate("/")}
            disabled={fetching}
          />
        </form>

        <Toast message={toast} clear={() => setToast("")} />
      </div>
    </div>
  );
}
