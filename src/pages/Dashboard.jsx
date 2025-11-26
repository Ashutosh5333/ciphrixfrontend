import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import TaskCard from '../components/TaskCard';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetchTasks = async (p = 1) => {
    setLoading(true);
    try {
      const res = await axios.get('/tasks', { params: { page: p, limit: 6 } });
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
      setPage(p);
    } catch (err) {
      console.error(err);
      setToast('Could not fetch tasks');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(1); }, []);

  const requestDelete = (id) => { setToDelete(id); setConfirmOpen(true); };
  const doDelete = async () => {
    try {
      await axios.delete(`/tasks/${toDelete}`);
      setTasks(t => t.filter(tk => tk._id !== toDelete));
      setToast('Task deleted');
    } catch (err) {
      console.error(err);
      setToast(err?.response?.data?.message || 'Delete failed');
    } finally {
      setConfirmOpen(false);
      setToDelete(null);
      setTimeout(() => setToast(''), 2500);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <div>
          <span className="text-sm text-gray-500">Role: {user.role}</span>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1,2,3].map(i => (
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
            {tasks.length === 0 ? <div className="text-center py-8">No tasks found.</div> : tasks.map(task => (
              <TaskCard key={task._id} task={task} onDelete={requestDelete} showDelete={user.role === 'admin'} />
            ))}
          </div>

          <Pagination pagination={pagination} onChange={fetchTasks} />
        </>
      )}

      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete this task? This action cannot be undone.</p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setConfirmOpen(false)} className="px-3 py-1 border rounded">Cancel</button>
            <button onClick={doDelete} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
          </div>
        </div>
      </Modal>

      <Toast message={toast} />
    </div>
  );
}
