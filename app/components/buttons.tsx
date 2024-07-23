/** @format */
"use client";
import { SignIn } from "@/lib/client/helpers";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export function LoginButton(props: { provider: string; label: string }) {
  const router = useRouter();

  const handleClick = () => {
    SignIn("google", { redirect: "/" });
  };

  return (
    <Button w={"100%"} bg={"black"} color="white" onClick={handleClick}>
      Login with {props.label}
    </Button>
  );
}
