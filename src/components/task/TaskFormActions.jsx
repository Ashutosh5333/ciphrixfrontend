import React from "react";
import Button from "../Button";

export default function TaskFormActions({ loading, isEdit, onCancel }) {
  return (
    <div className="flex items-center gap-5 pt-3">
      <Button loading={loading} className="w-full text-lg py-3">
        {isEdit ? "Save Changes" : "Create Task"}
      </Button>

      <button
        type="button"
        onClick={onCancel}
        className="w-full px-4 py-3 rounded-xl border text-gray-700 
          dark:text-gray-300 dark:border-gray-600 font-medium 
          hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        Cancel
      </button>
    </div>
  );
}
