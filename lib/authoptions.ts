import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import db from "./db/drizzle";
import { $users } from "./db/schema";
import { DrizzleError, eq } from "drizzle-orm";

const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
  // pages: {
  //   signIn: "/auth/sign-in",
  // },
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },

    async signIn({ user, account, profile }) {
      const userEmail = profile?.email || user.email;

      if (!userEmail) {
        // If the email is not found, disallow sign-in
        return false;
      }

      // Check if the user exists in the database
      const existingUsers = await db
        .select()
        .from($users)
        .where(eq($users.email, userEmail))
        .limit(1);

      if (existingUsers.length > 0) {
        const existingUser = existingUsers[0];

        // Logic to handle multiple providers
        if (existingUser.provider !== account!.provider) {
          // Update the existing user to include the new provider
          throw new Error("Email already used in another account");
        }

        return true;
      } else {
        try {
          await db.insert($users).values({
            email: userEmail,
            name: user.name!,
            provider: account!.provider,
            providerAccountId: account!.providerAccountId!,
            avatar: user.image,
          });
        } catch (error) {
          if (error instanceof DrizzleError) {
            throw new Error("Database error", error);
          } else {
            throw new Error("Unexpected error", error as any);
          }
        }
        // Allow sign-in
        return true;
      }
    },
  },
};

export default authOptions;
