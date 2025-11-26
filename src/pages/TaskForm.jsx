import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import Skeleton from "../components/Skeleton";
import Toast from "../components/Toast";

import { FiEdit3, FiTag, FiFileText } from "react-icons/fi";

export default function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingTask, setLoadingTask] = useState(false);
  const [toast, setToast] = useState("");

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  };

  useEffect(() => {
    if (id) {
      setLoadingTask(true);
      axios
        .get(`/tasks/${id}`)
        .then((res) => {
          setForm({
            title: res.data.title,
            description: res.data.description,
            status: res.data.status,
          });
        })
        .catch((err) => {
          setToast(err?.response?.data?.message || "Failed to load task");
        })
        .finally(() => setLoadingTask(false));
    }
  }, [id]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    if (loading) return;

    setLoading(true);
    try {
      if (id) {
        await axios.put(`/tasks/${id}`, form);
        setToast("Task updated");
      } else {
        await axios.post("/tasks", form);
        setToast("Task created");
      }

      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setToast(err?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {/* Glassmorphism Card */}
      <div className="
        p-8 rounded-3xl shadow-xl border
        bg-white/70 dark:bg-gray-800/60 
        backdrop-blur-xl backdrop-saturate-150
      ">
        <h2 className="text-3xl font-bold mb-7 flex items-center gap-3">
          <FiEdit3 className="text-blue-600" size={26} />
          {id ? "Edit Task" : "Add New Task"}
        </h2>

        {loadingTask ? (
          <div>
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">

            {/* Title */}
            <div className="relative group">
              <Input
                label="Task Title"
                name="title"
                value={form.title}
                onChange={onChange}
                icon={FiTag}
                placeholder="Enter a task title..."
                error={errors.title}
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium">Description</label>
              <div
                className={`mt-1 flex items-start gap-3 p-3 border rounded-xl 
                transition-all bg-white dark:bg-gray-700 
                ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <FiFileText className="text-gray-500 mt-1" />
                <textarea
                  name="description"
                  rows="4"
                  className="w-full bg-transparent outline-none"
                  placeholder="Write task details..."
                  value={form.description}
                  onChange={onChange}
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-4 mt-3">
                {/* Pending */}
                <button
                  type="button"
                  className={`px-5 py-2 rounded-full border text-sm font-medium transition duration-300
                    ${
                      form.status === "pending"
                        ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                        : "border-gray-300 dark:border-gray-600"
                    }
                  `}
                  onClick={() => setForm({ ...form, status: "pending" })}
                >
                  Pending
                </button>

                {/* Completed */}
                <button
                  type="button"
                  className={`px-5 py-2 rounded-full border text-sm font-medium transition duration-300
                    ${
                      form.status === "completed"
                        ? "bg-green-600 text-white border-green-600 shadow-lg"
                        : "border-gray-300 dark:border-gray-600"
                    }
                  `}
                  onClick={() => setForm({ ...form, status: "completed" })}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-5 pt-3">
              <Button loading={loading} className="w-full text-lg py-3">
                {id ? "Save Changes" : "Create Task"}
              </Button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full px-4 py-3 rounded-xl border text-gray-700 
                  dark:text-gray-300 dark:border-gray-600 font-medium 
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <Toast message={toast} clear={() => setToast("")} />
      </div>
    </div>
  );
}
