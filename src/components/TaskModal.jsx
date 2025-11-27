import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeTaskModal } from "../features/ui/uiSlice";
import TaskForm from "../pages/TaskForm"; 

export default function TaskModal() {
  const dispatch = useDispatch();
  const { taskModalOpen } = useSelector((s) => s.ui);

  if (!taskModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => dispatch(closeTaskModal())}
      />

      <div className="relative z-50 w-full max-w-2xl mx-4 animate-fadeIn">
        <TaskForm isModal />
      </div>
    </div>
  );
}
