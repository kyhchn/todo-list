import AuthButton from "@/components/AuthButton";
import React from "react";

export default function SignInPage() {
  return (
    <div>
      <AuthButton buttonText="Login with google" provider="google" />
      <AuthButton buttonText="Login with github" provider="github" />
    </div>
  );
}
