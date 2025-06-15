
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddGoalFormProps {
  onAddGoal: (goalTitle: string) => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed !== "") {
      onAddGoal(trimmed);
      setInputValue("");
    }
  };

  return (
    <form className="mb-6 flex items-center gap-4" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Add a new goal..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1"
      />
      <Button
        type="submit"
        className="whitespace-nowrap"
        disabled={inputValue.trim().length === 0}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Goal
      </Button>
    </form>
  );
};

export default AddGoalForm;
