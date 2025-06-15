import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface AddGoalFormProps {
  onAddGoal: (goalTitle: string) => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    console.log("AddGoalForm: handleAdd triggered; inputValue:", inputValue); // DEBUG
    const trimmed = inputValue.trim();
    if (trimmed) {
      console.log("AddGoalForm: Calling onAddGoal with:", trimmed); // DEBUG
      onAddGoal(trimmed);
      setInputValue("");
    } else {
      console.log("AddGoalForm: handleAdd - input was empty");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("AddGoalForm: form submit event");
    handleAdd();
  };

  return (
    <form onSubmit={handleFormSubmit} className="mb-6 flex items-center gap-4">
      <Input
        type="text"
        placeholder="Add a new goal..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
    </form>
  );
};

export default AddGoalForm;
