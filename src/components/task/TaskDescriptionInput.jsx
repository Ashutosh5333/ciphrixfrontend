import React from "react";
import { FiFileText } from "react-icons/fi";

export default function TaskDescriptionInput({ value, onChange, error }) {
  return (
    <div>
      <label className="text-sm font-medium">Description</label>
      <div
        className={`mt-1 flex items-start gap-3 p-3 border rounded-xl 
        transition bg-white dark:bg-gray-700
        ${
          error
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
          value={value}
          onChange={onChange}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
