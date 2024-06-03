import authOptions from "@/lib/authoptions";
import db from "@/lib/db/drizzle";
import { $tasks, $users } from "@/lib/db/schema";
import { generateBaseResponse } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user == null) {
      return NextResponse.json(
        generateBaseResponse({
          success: false,
          message: "Unauthorized",
        }),
        {
          status: 401,
        }
      );
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const deadline = formData.get("deadline") as string;
    if (!title || !deadline) {
      return NextResponse.json(
        generateBaseResponse({
          success: false,
          message: "Bad request",
        }),
        {
          status: 400,
        }
      );
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return NextResponse.json(
        generateBaseResponse({
          success: false,
          message: "Invalid deadline format",
        }),
        {
          status: 400,
        }
      );
    }

    const currentDate = new Date();
    if (deadlineDate.getTime() <= currentDate.getTime()) {
      return NextResponse.json(
        generateBaseResponse({
          success: false,
          message: "Deadline must be in the future",
        }),
        {
          status: 400,
        }
      );
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
        {
          status: 404,
        }
      );
    }

    const tasks = await db
      .insert($tasks)
      .values({
        finish: false,
        deadline: deadlineDate,
        title: title,
        authorId: users[0].id,
      })
      .returning({
        returning_id: $users.id,
      });

    return NextResponse.json(
      generateBaseResponse({
        success: true,
        data: {
          note_id: tasks[0].returning_id,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
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
