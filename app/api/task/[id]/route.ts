import authOptions from "@/lib/authoptions";
import db from "@/lib/db/drizzle";
import { $tasks, $users } from "@/lib/db/schema";
import { generateBaseResponse } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(params);
    console.log(params.id);
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        generateBaseResponse({
          success: false,
          message: "Invalid id",
        }),
        { status: 404 }
      );
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

    const tasks = await db.select().from($tasks).where(eq($tasks.id, id));

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
        message: "Server error",
      }),
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
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

    const tasks = await db.select().from($tasks).where(eq($tasks.id, id));

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

    const result = await db.delete($tasks).where(eq($tasks.id, id)).returning({
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
}
