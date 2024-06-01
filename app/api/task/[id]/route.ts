import authOptions from "@/lib/authoptions";
import db from "@/lib/db/drizzle";
import { $tasks, $users } from "@/lib/db/schema";
import { generateBaseResponse } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface params {
  id: string;
}

interface userSignature {
  email: string;
  id: string;
}
export default async function handler(req: NextRequest, params: params) {
  const id = params.id;
  if (!params || !Number.isInteger(id)) {
    return new Response("Id not valid", { status: 400 });
  }
  const session = await getServerSession(authOptions);

  if (!session || session.user == null) {
    return new Response("Unauthorized", { status: 401 });
  }

  const email = session!.user!.email!;

  const users = await db
    .select({
      email: $users.email,
      id: $users.id,
    })
    .from($users)
    .where(eq($users.email, email));

  if (users.length === 0) {
    return NextResponse.json(
      generateBaseResponse({
        success: false,
        message: "user not found",
      }),
      { status: 404 }
    );
  }
  const user = users.shift()!;

  // request type handler
  if (req.method === "GET") {
    getTask(id, user);
  } else if (req.method === "DELETE") {
    deleteTask(id, user);
  }

  return new Response("not found", {
    status: 404,
  });
}

const getTask = async (id: string, user: userSignature) => {
  try {
    const tasks = await db
      .select()
      .from($tasks)
      .where(eq($tasks.id, Number.parseInt(id)));

    const task = tasks[0];

    if (!task || task.authorId !== user.id) {
      return NextResponse.json(
        generateBaseResponse({
          success: false,
          message: "data not found",
        }),
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      generateBaseResponse({
        success: true,
        data: task,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      generateBaseResponse({
        success: false,
        message: "server error",
      }),
      {
        status: 500,
      }
    );
  }
};

const deleteTask = async (id: string, user: userSignature) => {
  try {
    const tasks = await db
      .select()
      .from($tasks)
      .where(eq($tasks.id, Number.parseInt(id)));

    const task = tasks[0];

    if (!task || task.authorId !== user.id) {
      return NextResponse.json(
        generateBaseResponse({
          success: false,
          message: "Data not found",
        }),
        {
          status: 404,
        }
      );
    }

    const result = await db
      .delete($tasks)
      .where(eq($tasks.id, Number.parseInt(id)))
      .returning({
        id: $tasks.id,
      });

    return NextResponse.json(
      generateBaseResponse({
        success: true,
        message: "Task deleted successfully",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      generateBaseResponse({
        success: false,
        message: "Server error",
      }),
      {
        status: 500,
      }
    );
  }
};
