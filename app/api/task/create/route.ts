import authOptions from "@/lib/authoptions";
import db from "@/lib/db/drizzle";
import { $tasks, $users } from "@/lib/db/schema";
import { generateBaseResponse } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user == null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title } = body;
    if (!title) {
      return new Response("Bad request", { status: 400 });
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

    const tasks = await db
      .insert($tasks)
      .values({
        finish: false,
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
        message: "server error",
      }),
      {
        status: 500,
      }
    );
  }
}
