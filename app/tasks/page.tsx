import React from "react";
import { Separator } from "@/components/ui/separator";
import Tasks from "@/components/Tasks";
import { TaskType } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import ProfileInfo from "@/components/ProfileInfo";
import SignoutButton from "@/components/SignoutButton";
import CreateDialog from "@/components/CreateDialog";

async function getTasks(page: number) {
  const response = await fetch(
    `${process.env.LOCAL_URL}/api/task?page=${page}&take=${6}`,
    {
      headers: new Headers(headers()),
      next: {
        tags: ["task"],
      },
    }
  );
  if (response.status != 200) {
    return null;
  }
  const data = await response.json();
  console.log(data);
  return data.data.tasks as TaskType[];
}

const Page = async () => {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/auth/sign-in");
  }
  const tasks = await getTasks(1);
  return (
    <div className="bg-gradient-to-r from-yellow-100 to-teal-100 min-h-screen">
      {session && (
        <div className="max-w-[calc(100vw-40px)] mx-auto p-10">
          <div className="flex flex-row justify-between items-center">
            <ProfileInfo
              imageUrl={session.user.image}
              name={session.user.name}
            />
            <div className="flex flex-row items-center gap-x-2">
              <CreateDialog />
              <SignoutButton />
            </div>
          </div>
          <Separator className="my-3 bg-slate-300" />
          {tasks && <Tasks tasks={tasks} />}
          <div className="grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-4"></div>
        </div>
      )}
    </div>
  );
};
export default Page;
