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
      className="bg-emerald-500 rounded-2xl p-3"
      onClick={() => signIn("google", { callbackUrl: redirect })}
    >
      {buttonText}
    </button>
  );
}
