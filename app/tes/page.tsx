"use client";
import AuthButton from "@/components/AuthButton";
import SignoutButton from "@/components/SignoutButton";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  return (
    <div>
      <h1>Home Page</h1>
      {session.status == "authenticated" ? (
        <h1>{JSON.stringify(session!.data!.user!.name)}</h1>
      ) : (
        <h2>User not logged</h2>
      )}
      <AuthButton buttonText="Login with google" provider="google" />
      <AuthButton buttonText="Login with github" provider="github" />
      <SignoutButton />
      <h2>Unavailable without auth</h2>
      <form
      // action={async () => {
      //   // signOut() Method will be declared later
      //   'use server';
      //   await signOut();
      // }}
      >
        <button>Log Out</button>
      </form>
    </div>
  );
}
