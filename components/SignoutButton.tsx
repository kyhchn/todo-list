"use client";
import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { SignOut } from "@phosphor-icons/react/dist/ssr";

export default function SignoutButton() {
  return (
    <Button
      variant="destructive"
      onClick={() =>
        signOut({
          callbackUrl: "/",
          redirect: true,
        })
      }
    >
      <div className="flex flex-row items-center gap-x-2">
        <SignOut size={24} />
        <p>Signout</p>
      </div>
    </Button>
  );
}
