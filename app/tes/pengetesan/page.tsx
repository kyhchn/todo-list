"use client";
import { useSession } from "next-auth/react";
import React from "react";

export default function Page() {
  const session = useSession();
  
  return (
    <div className="size-full flex flex-col">
      <h1>List Note</h1>
    </div>
  );
}
