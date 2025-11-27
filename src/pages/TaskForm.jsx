import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTask,
  updateTask,
  fetchTaskById,
  clearCurrentTask,
} from "../features/tasks/taskSlice";
import { closeTaskModal } from "../features/ui/uiSlice";

import Card from "../components/ui/Card";
import TextInput from "../components/ui/TextInput";
import TextArea from "../components/ui/TextArea";
import StatusSelector from "../components/ui/StatusSelector";
import Button from "../components/Button";
import Toast from "../components/Toast";

export default function TaskForm() {
  const dispatch = useDispatch();
  const { currentTask, loading } = useSelector((s) => s.tasks);
  const { editTaskId } = useSelector((s) => s.ui);

  const isEdit = Boolean(editTaskId);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isEdit) {
      dispatch(clearCurrentTask());
      return;
    }

    if (currentTask && currentTask._id === editTaskId) {
      setForm({
        title: currentTask.title,
        description: currentTask.description,
        status: currentTask.status,
      });
      return;
    }

    setFetching(true);
    dispatch(fetchTaskById(editTaskId))
      .unwrap()
      .then((data) =>
        setForm({
          title: data.title,
          description: data.description,
          status: data.status,
        })
      )
      .catch(() => setToast("Failed to load task"))
      .finally(() => setFetching(false));
  }, [dispatch, isEdit, editTaskId, currentTask]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      if (isEdit) {
        await dispatch(updateTask({ editTaskId, ...form })).unwrap();
        setToast("Task updated");
      } else {
        await dispatch(createTask(form)).unwrap();
        setToast("Task created");
      }
      dispatch(closeTaskModal());
    } catch (err) {
      setToast(err || "Save failed");
    }
  };

  return (
    <Card>
      <h2 className="text-3xl font-bold mb-7 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {isEdit ? "Edit Task" : "Create Task"}
      </h2>

      <form onSubmit={submit} className="space-y-6">
        <TextInput
          label="Title"
          name="title"
          value={form.title}
          onChange={onChange}
          error={errors.title}
          disabled={fetching}
          placeholder="Enter task title"
        />

        <TextArea
          label="Description"
          name="description"
          value={form.description}
          onChange={onChange}
          error={errors.description}
          disabled={fetching}
          placeholder="Describe the task"
        />

        <StatusSelector
          value={form.status}
          onChange={(v) => setForm({ ...form, status: v })}
          disabled={fetching}
        />

        <div className="flex flex-col gap-3">
          <Button loading={loading} 
           loadingText={isEdit ? "Saving changes..." : "Creating task..."}
           >
            {isEdit ? "Save Changes" : "Create Task"}
          </Button>

          <Button variant="outline" onClick={() => dispatch(closeTaskModal())}>
            Cancel
          </Button>
        </div>
      </form>

      <Toast message={toast} clear={() => setToast("")} />
    </Card>
  );
}
