import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTask,
  updateTask,
  fetchTaskById,
  clearCurrentTask,
} from "../features/tasks/taskSlice";
import { useNavigate, useParams } from "react-router-dom";
import TaskTitleInput from "../components/task/TaskTitleInput";
import TaskDescriptionInput from "../components/task/TaskDescriptionInput";
import TaskStatusSelector from "../components/task/TaskStatusSelector";
import TaskFormActions from "../components/task/TaskFormActions";
import Toast from "../components/Toast";
import { closeTaskModal } from "../features/ui/uiSlice";

export default function TaskForm() {
  const { editTaskId } = useSelector((s) => s.ui);
  const isEdit = Boolean(editTaskId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTask, loading } = useSelector((s) => s.tasks);

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
  }, [dispatch, editTaskId, isEdit, currentTask]);

  const validate = useCallback(() => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  }, [form]);

  const onChange = useCallback(
    (e) => setForm({ ...form, [e.target.name]: e.target.value }),
    [form]
  );

  const submit = useCallback(
    async (e) => {
      e.preventDefault();

      const errs = validate();
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;

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
    },
    [form, isEdit, editTaskId, validate, dispatch, navigate]
  );

  const titleSection = useMemo(
    () => (
      <h2 className="text-3xl font-bold mb-7">
        {isEdit ? "Edit Task" : "Add New Task"}
      </h2>
    ),
    [isEdit]
  );

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="p-8 rounded-3xl shadow-xl border bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl">
        {titleSection}

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
            loading={loading}
            isEdit={isEdit}
            onCancel={() => dispatch(closeTaskModal())}
          />
        </form>

        <Toast message={toast} clear={() => setToast("")} />
      </div>
    </div>
  );
}
