/** @format */
"use client";
import { SignIn } from "@/lib/client/helpers";
import { useRouter } from "next/navigation";

export function LoginButton(props: { provider: string; label: string }) {
  const router = useRouter();

  const handleClick = () => {
    SignIn("google", { redirect: "/" });
  };

  return <button onClick={handleClick}>Login with {props.label}</button>;
}
