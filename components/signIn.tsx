"use client";

import { signIn } from "next-auth/react";

export default function SignIn({
  buttonText,
  redirect,
}: {
  buttonText: string;
  redirect: string;
}) {
  return (
    <button
      type="submit"
      className="bg-amber-500 rounded-2xl p-5"
      onClick={() => signIn("google", { callbackUrl: redirect })}
    >
      {buttonText}
    </button>
  );
}
