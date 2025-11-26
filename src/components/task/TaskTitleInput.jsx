import React from "react";
import Input from "../Input";
import { FiTag } from "react-icons/fi";

export default function TaskTitleInput({ value, onChange, error }) {
  return (
    <div className="relative">
      <Input
        label="Task Title"
        name="title"
        value={value}
        onChange={onChange}
        icon={FiTag}
        placeholder="Enter task title..."
        error={error}
      />
    </div>
  );
}
