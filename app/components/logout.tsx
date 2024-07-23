"use client";

import { Button } from "@chakra-ui/react";
import { SignOut } from "@/lib/client";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const handleClick = async () => {
    try {
      await SignOut();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button w={"200px"} border={"1px"} onClick={handleClick}>
      logout
    </Button>
  );
}
