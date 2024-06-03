import Task from "@/components/Task";
import { TaskType } from "@/lib/db/schema";
import { headers } from "next/headers";

type Props = {
  params: {
    id: string;
  };
};

async function getTask(id: number) {
  try {
    const response = await fetch("http://localhost:3000/api/task/" + id, {
      headers: headers(),
      next: {
        tags: [`task/${id}`],
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data.data as TaskType;
    }
    return data.message as string;
  } catch (error) {
    console.error(error);
    return "unknown error";
  }
}

const Page = async ({ params: { id } }: Props) => {
  const task = await getTask(parseInt(id));
  return (
    <div className="min-h-screen px-5">
      {task && typeof task === "string" ? (
        <p>task</p>
      ) : (
        <Task task={task as TaskType} />
      )}
    </div>
  );
};

export default Page;
