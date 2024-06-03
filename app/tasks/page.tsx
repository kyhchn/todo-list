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
import { redirect } from "next/navigation";

const Page = () => {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<TaskType[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [totalPage, setTotalPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("latest");

  const infiniteHandler = () => {
    if (page < totalPage) {
      setPage(page + 1);
    }
  };
  async function getTasks() {
    if (page <= totalPage) {
      setIsLoading(true);
      const urlParams = urlParamBuilder({
        page: page.toString(),
        take: "6",
        order: sort,
        title: title,
      });
      const response = await fetch(`/api/task?${urlParams}`);
      console.log(response);
      if (response.status != 200) {
        return null;
      }
      const data = await response.json();
      setTasks(data.data.tasks as TaskType[]);
      setTotalPage(data.data.totalPages);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    const update = setTimeout(() => {
      getTasks();
    }, 500);

    return () => clearTimeout(update);
  }, [page, sort, title, totalPage]);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/sign-in");
    }
  }, [status]);
  return (
    <div className="bg-gradient-to-r from-yellow-100 to-teal-100 min-h-screen">
      {status === "authenticated" && session && (
        <div className="max-w-[calc(100vw-40px)] mx-auto p-10">
          <div className="flex flex-row justify-between items-center">
            <ProfileInfo
              imageUrl={session!.user!.image}
              name={session!.user!.name}
            />

            <div className="flex flex-row items-center gap-x-2">
              <CreateDialog />
              <SignoutButton />
            </div>
          </div>
          <div className="flex flex-row items-center justify-start mt-4 gap-x-2">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Deadline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Nearest</SelectItem>
                <SelectItem value="oldest">Furthest</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title.."
            />
          </div>
          <Separator className="my-3 bg-slate-300" />
          {tasks && <Tasks tasks={tasks} />}
          <LoadMore setPage={infiniteHandler} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};
export default Page;
