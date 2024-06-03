import { TaskType } from "@/lib/db/schema";
import React from "react";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { CheckboxComponent } from "./TaskCheckbox";

interface TaskProps {
  tasks: TaskType[] | null;
}

export default function Tasks({ tasks }: TaskProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2">
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map((task, idx) => {
            const convertedDate = new Date(task.deadline);
            return (
              <Link
                href={`/tasks/${task.id!}`}
                key={idx}
                className="bg-white cursor-pointer hover:bg-slate-200  transition-all duration-200 rounded-xl p-4 flex flex-row items-center justify-between gap-x-2"
              >
                <div className="flex flex-row items-center justify-start gap-x-2">
                  <CheckboxComponent idx={idx} task={task} />
                  <Separator orientation="vertical" />
                  <p>{task.title}</p>
                </div>

                <p>{convertedDate.toDateString()}</p>
              </Link>
            );
          })}
        </ul>
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
}
