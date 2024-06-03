"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, CalendarCheck, Loader2 } from "lucide-react";
import { DeleteButon } from "@/components/DeleteButton";
import TipTapEditor from "@/components/TipTapEditor";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { TaskType } from "@/lib/db/schema";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Check, X } from "@phosphor-icons/react/dist/ssr";
import { useMutation, useQueryClient } from "react-query";
import revalidateCache from "@/lib/actions/revalidate";

interface pageProps {
  task: TaskType;
}

const Task = ({ task }: pageProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [firstMutate, setFirstMutate] = useState(true);
  const [title, setTitle] = useState(task.title);
  const [deadline, setDeadline] = React.useState<Date | undefined>(
    new Date(task.deadline.toString())
  );
  const [desc, setDesc] = React.useState(task.desc);
  const [finish, setFinish] = React.useState<boolean>(task.finish);
  const taskDeadline = new Date(task.deadline);

  const dateNow = new Date();

  const toggleFinish = () => {
    setFinish(!finish);
  };

  const updateTaskMutation = useMutation(
    async () => {
      const response = await fetch("/api/task/save", {
        method: "PATCH",
        body: JSON.stringify({
          title: title,
          deadline: deadline?.toISOString(),
          desc: desc,
          finish: finish,
          id: task?.id,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error saving tasks");
      }
      return response.json();
    },
    {
      onSuccess: (data) => {
        setFirstMutate(false);
        queryClient.invalidateQueries(["tasks"]);
        revalidateCache(`task/${task.id}`);
        toast({
          description: "Task successfully updated",
        });
      },
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          description: error.message,
        });
      },
    }
  );

  useEffect(() => {
    const update = setTimeout(() => {
      if (firstMutate) {
        console.log("deadline is", deadline?.toISOString());
        console.log("task date is ", taskDeadline.toISOString());
        if (
          title !== task.title ||
          desc !== task.desc ||
          taskDeadline.toISOString() !== deadline?.toISOString() ||
          task.finish !== finish
        ) {
          updateTaskMutation.mutate();
        }
      } else {
        console.log("Mutation started");
        updateTaskMutation.mutate();
      }
    }, 500);

    return () => clearTimeout(update);
  }, [title, finish, deadline, desc]);

  useEffect(() => {
    console.log("deadline changed ", deadline?.toISOString());
  }, [deadline]);

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white p-4 shadow-lg rounded-xl mt-8">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={() => {
                router.back();
                router.refresh();
              }}
            >
              <ArrowLeft />
            </button>
            <input
              type="text"
              className="outline-none border-none"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-row items-center justify-start gap-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button">
                  <div className="flex flex-row items-center justify-start gap-x-2">
                    <CalendarCheck size={24} />
                    <p>{deadline?.toDateString()}</p>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  fromDate={dateNow}
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              variant={finish ? "default" : "secondary"}
              onClick={toggleFinish}
            >
              <div className="flex flex-row gap-x-2 items-center">
                {finish ? (
                  <>
                    <X weight="bold" />
                    <p>Unfinish</p>
                  </>
                ) : (
                  <>
                    <Check weight="bold" />
                    <p>Finish</p>
                  </>
                )}
              </div>
            </Button>
            <Button className="bg-teal-500 hover:bg-teal-400" disabled>
              {updateTaskMutation.isLoading && (
                <Loader2 className="animate-spin mr-1" size={16} />
              )}
              Save
            </Button>
            <DeleteButon taskId={task.id!} />
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-4 shadow-lg rounded-xl mt-4 prose">
        <TipTapEditor setDesc={setDesc} task={task} />
      </div>
    </>
  );
};

export default Task;
