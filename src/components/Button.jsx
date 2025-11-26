import React from "react";
import { FiLoader } from "react-icons/fi";

export default function Button({ children, loading, className="", ...props }) {
  return (
    <button
      disabled={loading}
      className={`px-4 py-2 rounded bg-blue-600 text-white w-full flex justify-center items-center gap-2 
      ${loading ? "opacity-70 cursor-not-allowed" : ""}
      ${className}`}
      {...props}
    >
      {loading && <FiLoader className="animate-spin" />}
      {children}
    </button>
  );
}
