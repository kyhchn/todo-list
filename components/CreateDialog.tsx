"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { useMutation, useQueryClient } from "react-query";

const CreateDialog = () => {
  const { toast } = useToast();
  const [input, setInput] = React.useState("");
  const queryClient = useQueryClient();
  const currentDate = new Date();
  const [date, setDate] = React.useState<Date | undefined>();
  const router = useRouter();

  const createTaskMutation = useMutation(
    async (formData: FormData) => {
      const response = await fetch("/api/task/create", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      return response.json();
    },
    {
      onSuccess: (data) => {
        toast({
          description: "Success to create todo",
        });
        queryClient.invalidateQueries(["tasks"]);
        router.push("/tasks/" + data["data"]["task_id"]);
      },
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          description: error.message,
        });
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input === "") {
      toast({
        variant: "destructive",
        description: "Please provide the title",
      });
      return;
    }

    if (date == undefined) {
      toast({
        variant: "destructive",
        description: "Please choose the deadline",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", input);
    formData.append("deadline", date.toString());

    createTaskMutation.mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <div className="flex flex-row items-center gap-x-2">
            <Plus size={24} />
            <p>Add Task</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Create Task</DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Name.."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" className="mt-4">
                <div className="flex flex-row items-center justify-start gap-x-2">
                  <CalendarCheck size={24} />
                  <p>{date?.toDateString() || "pick date"}</p>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                fromDate={currentDate}
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="flex flex-row justify-end items-center gap-4 mt-4">
            <Button type="submit" className="bg-teal-600">
              {createTaskMutation.isLoading && (
                <Loader2 className="animate-spin mr-2" size={16} />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
