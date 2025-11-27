import { useDispatch, useSelector } from "react-redux";
import { openTaskModal } from "../features/ui/uiSlice";
import { fetchTaskById } from "../features/tasks/taskSlice";
import OverlayLoader from "./ui/OverlayLoader";

export default function TaskCard({ task, onDelete, showDelete }) {
  const dispatch = useDispatch();
  const { singleloading } = useSelector((s) => s.tasks);

  const handleEdit = async (taskId) => {
    try {
      await dispatch(fetchTaskById(taskId)).unwrap();

      dispatch(openTaskModal(taskId));
    } catch (err) {
      console.error("Failed to prefetch:", err);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <p className="text-sm mt-1">{task.description}</p>
          <div className="text-xs mt-2 text-gray-500">
            {task.status === "completed" ? "✅ Completed" : "⏳ Pending"} •{" "}
            {task.createdAt}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(task._id)}
            className="px-3 py-1 border rounded"
          >
            Edit
          </button>

          {showDelete && (
            <button
              onClick={() => onDelete(task._id)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {singleloading && <OverlayLoader />}
    </>
  );
}
