import { TaskType } from "@/lib/db/schema";
import React from "react";
import Link from "next/link";
import { CheckboxComponent } from "./TaskCheckbox";
import { Separator } from "./ui/separator";

interface TaskProps {
  tasks: TaskType[] | null;
}

export default function Tasks({ tasks }: TaskProps) {
  return (
    <div className="w-full grid grid-cols-1 gap-y-4">
      {tasks && tasks.length > 0
        ? tasks.map((task, idx) => {
            const convertedDate = new Date(task.deadline);
            return (
              <Link
                href={`/tasks/${task.id}`}
                key={task.id}
                className="bg-white cursor-pointer hover:bg-slate-200 hover:-translate-y-1 transition-all duration-200 rounded-xl p-4 flex flex-row items-center justify-between gap-x-4"
              >
                <div className="flex flex-row items-center justify-start gap-x-4">
                  <CheckboxComponent idx={idx} task={task} />
                  <Separator orientation="vertical" />
                  <p>{task.title}</p>
                </div>

                <p>{convertedDate.toDateString()}</p>
              </Link>
            );
          })
        : null}
    </div>
  );
}
