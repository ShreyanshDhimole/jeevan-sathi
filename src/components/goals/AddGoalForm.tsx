
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddGoalFormProps {
  onAddGoal: (goalTitle: string) => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    console.log("AddGoalForm: handleAdd triggered");
    const trimmed = inputValue.trim();
    if (trimmed) {
      console.log("AddGoalForm: Calling onAddGoal with:", trimmed);
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

  return (
    <div className="mb-6 flex items-center gap-4">
      <Input
        type="text"
        placeholder="Add a new goal..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Button
        onClick={handleAdd}
        className="whitespace-nowrap"
        disabled={inputValue.trim().length === 0}
      >
        Save Goal
      </Button>
    </div>
  );
};

export default AddGoalForm;
