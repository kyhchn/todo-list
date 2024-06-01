import authOptions from "@/lib/authoptions";
import db from "@/lib/db/drizzle";
import { $tasks, $users } from "@/lib/db/schema";
import { generateBaseResponse } from "@/lib/utils";
import { count } from "drizzle-orm";
import { and, desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
const dynamic = "force-dynamic";
const revalidate = 0;
export default async function GET(req: NextRequest) {
  try {
    // check the user
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

    const { title, orderby, page = 1, take = 10 } = await req.json();

    // Validate the parameters
    if (!title) {
      return NextResponse.json(
        generateBaseResponse({
          success: false,
          message: "Title parameter is required",
        }),
        { status: 400 }
      );
    }

    // Validate the orderby parameter if provided
    const validOrderBys = ["latest", "oldest"];
    if (orderby && !validOrderBys.includes(orderby)) {
      return NextResponse.json(
        generateBaseResponse({
          success: false,
          message: "Invalid orderby parameter",
        }),
        { status: 400 }
      );
    }

    const offset = (page - 1) * take;

    const totalCountResult = await db
      .select({
        count: count(),
      })
      .from($tasks)
      .where(and(eq($tasks.authorId, user.id), eq($tasks.title, title)));

    const totalCount = totalCountResult[0].count;
    const totalPages = Math.ceil(totalCount / take);

    // Perform the database query with optional ordering and pagination
    const query = db
      .select()
      .from($tasks)
      .where(and(eq($tasks.authorId, user.id), eq($tasks.title, title)))
      .offset(offset)
      .limit(take);

    if (orderby) {
      if (orderby == "latest") {
        query.orderBy(desc($tasks.updatedAt));
      } else {
        query.orderBy($tasks.updatedAt);
      }
    }

    // Add the pagination limitation

    const tasks = await query;

    // Return the response
    return NextResponse.json(
      generateBaseResponse({
        success: true,
        data: {
          success: true,
          data: tasks,
          totalPages: totalPages,
          page: page,
          take: take,
        },
      }),
      { status: 200 }
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
}
