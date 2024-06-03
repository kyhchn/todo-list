"use client";

import React from "react";
import { Button } from "./ui/button";
import { LiteralUnion, signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";

interface AuthButtonProps {
  provider: LiteralUnion<BuiltInProviderType>;
  buttonText: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ provider, buttonText }) => {
  return (
    <Button
      onClick={() =>
        signIn(provider, {
          callbackUrl: "/tasks",
          redirect: true,
        })
      }
    >
      {buttonText}
    </Button>
  );
};

export default AuthButton;
