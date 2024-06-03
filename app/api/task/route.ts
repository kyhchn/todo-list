import authOptions from "@/lib/authoptions";
import db from "@/lib/db/drizzle";
import { $tasks, $users } from "@/lib/db/schema";
import { generateBaseResponse } from "@/lib/utils";
import { count, ilike, like } from "drizzle-orm";
import { and, desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // check the user
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
    const user = users.shift()!;

    const { searchParams } = req.nextUrl;
    const title = searchParams.get("title");
    const order = searchParams.get("order");
    const page = parseInt(searchParams.get("page") || "1");
    const take = parseInt(searchParams.get("take") || "10");

    // Validate the orderby parameter if provided
    const validOrderBys = ["nearest", "furthest"];
    if (order && !validOrderBys.includes(order)) {
      return NextResponse.json(
        generateBaseResponse({
          success: false,
          message: "Invalid orderby parameter",
        }),
        {
          status: 400,
        }
      );
    }

    const offset = (page - 1) * take;

    const conditions = [eq($tasks.authorId, user.id)];
    if (title) {
      conditions.push(ilike($tasks.title, `%${title.trim()}%`));
    }

    const totalCountResult = await db
      .select({
        count: count(),
      })
      .from($tasks)
      .where(and(...conditions));

    const totalCount = totalCountResult[0].count;
    let totalPages = Math.ceil(totalCount / take);
    if (totalPages <= 0) {
      totalPages = 1;
    }

    // Perform the database query with optional ordering and pagination
    const query = db
      .select()
      .from($tasks)
      .where(and(...conditions))
      .offset(offset)
      .limit(take);

    if (order) {
      if (order === "nearest") {
        query.orderBy($tasks.deadline);
      } else {
        query.orderBy(desc($tasks.deadline));
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
          tasks: tasks,
          totalPages: totalPages,
          page: page,
          take: take,
        },
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
