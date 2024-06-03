"use client";

import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { TaskType } from "@/lib/db/schema";
import revalidateCache from "@/lib/actions/revalidate";

interface CheckboxComponentProps {
  task: TaskType;
  idx: number;
}

export function CheckboxComponent({ task, idx }: CheckboxComponentProps) {
  const [isChecked, setIsChecked] = useState(task.finish);

  const handleCheckedChange = async (val: boolean) => {
    setIsChecked(val);
    const response = await fetch("/api/task/save", {
      method: "PATCH",
      body: JSON.stringify({
        finish: val,
        id: task.id,
      }),
    });
    if (response.ok) {
      revalidateCache("task/" + task.id);
    }
  };

  return (
    <Checkbox
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleCheckedChange(!isChecked);
      }}
      id={idx.toString()}
      checked={isChecked}
    />
  );
}
