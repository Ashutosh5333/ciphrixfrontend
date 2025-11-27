import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask } from "../features/tasks/taskSlice";
import TaskCard from "../components/TaskCard";
import Pagination from "../components/Pagination";
import Skeleton from "../components/Skeleton";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import TaskModal from "../components/TaskModal";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { list, pagination, fetchLoading ,loading } = useSelector((s) => s.tasks);
  const auth = useSelector((s) => s.auth);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks({ page }));
  }, [dispatch, page]);

  const requestDelete = (id) => {
    setToDelete(id);
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    setConfirmOpen(false);
    try {
      await dispatch(deleteTask(toDelete)).unwrap();
      dispatch(fetchTasks({ page }));
      setToast("Task deleted");
    } catch (err) {
      setToast(err || "Delete failed");
    } finally {
      setToDelete(null);
      setTimeout(() => setToast(""), 2500);
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <div>
            <span className="text-sm text-gray-500">
              Role: {auth.user?.role || "guest"}
            </span>
          </div>
        </div>

        {fetchLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {list.length === 0 ? (
                <div className="text-center py-8">No tasks found.</div>
              ) : (
                list.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={requestDelete}
                    showDelete={auth.user?.role === "admin"}
                  />
                ))
              )}
            </div>

            <Pagination pagination={pagination} onChange={(p) => setPage(p)} />
          </>
        )}

        <Modal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Confirm delete"
        >
          <div className="space-y-4">
            <p>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

        <Toast message={toast} clear={() => setToast("")} />

        <TaskModal />
      </div>

    </>
  );
}
