import authOptions from "@/lib/authoptions";
import db from "@/lib/db/drizzle";
import { $tasks, $users, TaskType } from "@/lib/db/schema";
import { generateBaseResponse } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const { id, title, desc, finish = false, deadline } = await req.json();
    if (!parseInt(id)) {
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
          message: "User not found",
        }),
        { status: 404 }
      );
    }
    const user = users.shift()!;
    const convertedDeadline = deadline ? new Date(deadline) : undefined;

    // const struct: TaskType = {
    //   finish: finish,
    //   title: title,
    //   desc: desc,
    // };

    // // Filter out keys with null or undefined values
    // const filteredStruct: Partial<TaskType> = Object.fromEntries(
    //   Object.entries(struct).filter(([_, value]) => value != null)
    // );
    const result = (
      await db
        .update($tasks)
        .set({
          finish: finish,
          desc: desc,
          title: title,
          deadline: convertedDeadline,
        })
        .where(and(eq($tasks.id, id), eq($tasks.authorId, user.id)))
        .returning({
          id: $tasks.id,
        })
    ).shift();

    if (!result) {
      return NextResponse.json(
        generateBaseResponse({
          success: false,
          message: "Task not found or you are not authorized to update it",
        }),
        { status: 404 }
      );
    }

    return NextResponse.json(
      generateBaseResponse({
        success: true,
        message: "Task updated successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      generateBaseResponse({
        success: false,
        message: "Server error",
      }),
      { status: 500 }
    );
  }
}
