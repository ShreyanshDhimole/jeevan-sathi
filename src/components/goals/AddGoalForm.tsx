
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddGoalFormProps {
  onAddGoal: (goalTitle: string) => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onAddGoal(trimmed);
      setInputValue("");
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
        <Plus className="h-4 w-4 mr-2" />
        Add New Goal
      </Button>
    </div>
  );
};

export default AddGoalForm;
