
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
    console.log("Form submitted with value:", inputValue);
    e.preventDefault();
    const trimmed = inputValue.trim();
    console.log("Trimmed value:", trimmed);
    if (trimmed !== "") {
      console.log("Calling onAddGoal with:", trimmed);
      onAddGoal(trimmed);
      setInputValue("");
      console.log("Input cleared");
    } else {
      console.log("Input is empty, not adding goal");
    }
  };

  const handleButtonClick = () => {
    console.log("Button clicked directly");
  };

  return (
    <form className="mb-6 flex items-center gap-4" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Add a new goal..."
        value={inputValue}
        onChange={(e) => {
          console.log("Input changed to:", e.target.value);
          setInputValue(e.target.value);
        }}
        className="flex-1"
      />
      <Button
        type="submit"
        className="whitespace-nowrap"
        disabled={inputValue.trim().length === 0}
        onClick={handleButtonClick}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Goal
      </Button>
    </form>
  );
};

export default AddGoalForm;
