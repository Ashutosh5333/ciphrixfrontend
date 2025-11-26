import React from 'react';
import { Link } from 'react-router-dom';
import { formatRelative } from '../utils/date';

export default function TaskCard({ task, onDelete, showDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm flex flex-col sm:flex-row justify-between gap-4">
      <div>
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <p className="text-sm mt-1">{task.description || 'No description'}</p>
        <div className="text-xs mt-2 text-gray-500">
          {task.status === 'completed' ? <span className="mr-2">✅ Completed</span> : <span className="mr-2">⏳ Pending</span>}
          <span>• {formatRelative(task.createdAt)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link to={`/tasks/${task._id}/edit`} className="px-3 py-1 border rounded">Edit</Link>
        {showDelete && <button onClick={() => onDelete(task._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>}
      </div>
    </div>
  );
}
