"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Tasks from "@/components/Tasks";
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
import { useInfiniteQuery } from "react-query";

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const fetchTasks = async (pageParam: number, sort: string, title: string) => {
  const urlParams = urlParamBuilder({
    page: pageParam.toString(),
    take: "6",
    order: sort,
    title: title,
  });
  const response = await fetch(`/api/task?${urlParams}`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
};

const Page = () => {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [sort, setSort] = useState<string>("nearest");

  const debouncedTitle = useDebounce(title, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery(
    ["tasks", sort, debouncedTitle],
    ({ pageParam = 1 }) => fetchTasks(pageParam, sort, debouncedTitle),
    {
      getNextPageParam: (lastPage, allPages) => {
        const { totalPages } = lastPage.data;
        const nextPage = allPages.length + 1;
        return nextPage <= totalPages ? nextPage : undefined;
      },
    }
  );

  const tasks = data?.pages.flatMap((page) => page.data.tasks) ?? [];

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/api/auth/signin");
    }
  }, [status]);

  return (
    <div className="bg-gradient-to-r from-yellow-100 to-teal-100 min-h-screen">
      {status === "authenticated" && session && (
        <div className="max-w-[calc(100vw-40px)] mx-auto p-10">
          <div className="flex flex-row justify-between items-center">
            <ProfileInfo
              imageUrl={session.user?.image}
              name={session.user?.name}
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
                <SelectItem value="nearest">Nearest</SelectItem>
                <SelectItem value="furthest">Furthest</SelectItem>
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
          <LoadMore setPage={fetchNextPage} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default Page;
