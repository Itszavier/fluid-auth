/** @format */
"use client";
import { useRouter } from "next/navigation";

export function LoginButton(props: { provider: string; label: string }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/api/auth/signin?provider=${props.provider}`);
  };
  return <button onClick={handleClick}>Login with {props.label}</button>;
}
