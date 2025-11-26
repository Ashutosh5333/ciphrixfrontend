import React from "react";

export default function TaskStatusSelector({ value, setValue }) {
  return (
    <div>
      <label className="text-sm font-medium">Status</label>

      <div className="flex gap-4 mt-3">
        <button
          type="button"
          onClick={() => setValue("pending")}
          className={`px-5 py-2 rounded-full border text-sm font-medium transition 
            ${
              value === "pending"
                ? "bg-orange-500 text-white border-orange-500 shadow-md"
                : "border-gray-300 dark:border-gray-600"
            }
          `}
        >
          Pending
        </button>

        <button
          type="button"
          onClick={() => setValue("completed")}
          className={`px-5 py-2 rounded-full border text-sm font-medium transition 
            ${
              value === "completed"
                ? "bg-green-600 text-white border-green-600 shadow-md"
                : "border-gray-300 dark:border-gray-600"
            }
          `}
        >
          Completed
        </button>
      </div>
    </div>
  );
}
