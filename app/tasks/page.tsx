"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Tasks from "@/components/Tasks";
import { TaskType } from "@/lib/db/schema";
import ProfileInfo from "@/components/ProfileInfo";
import SignoutButton from "@/components/SignoutButton";
import CreateDialog from "@/components/CreateDialog";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { urlParamBuilder } from "@/lib/utils";
import LoadMore from "@/components/LoadMore";

const Page = () => {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<TaskType[]>();
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [sort, setSort] = useState<string | undefined>();
  useEffect(() => {
    async function getTasks() {
      const urlParams = urlParamBuilder({
        page: page.toString(),
        take: "6",
        sort: sort,
        title: title,
      });
      const response = await fetch(`/api/task?${urlParams}`);
      if (response.status != 200) {
        return null;
      }
      const data = await response.json();
      setTasks(data.data.tasks as TaskType[]);
    }

    const update = setTimeout(() => {
      getTasks();
    }, 500);

    return () => clearTimeout(update);
  }, [page, sort, title]);
  return (
    <div className="bg-gradient-to-r from-yellow-100 to-teal-100 min-h-screen">
      {status === "authenticated" && session && (
        <div className="max-w-[calc(100vw-40px)] mx-auto p-10">
          <div className="flex flex-row justify-between items-center">
            <ProfileInfo
              imageUrl={session!.user!.image}
              name={session!.user!.name}
            />
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Deadline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Nearest</SelectItem>
                <SelectItem value="dark">Furthest</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title.."
            />

            <div className="flex flex-row items-center gap-x-2">
              <CreateDialog />
              <SignoutButton />
            </div>
          </div>
          <Separator className="my-3 bg-slate-300" />
          {tasks && <Tasks tasks={tasks} />}
          <LoadMore page={page} setPage={setPage} />
        </div>
      )}
    </div>
  );
};
export default Page;
