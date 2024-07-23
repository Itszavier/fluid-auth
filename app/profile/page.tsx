"use client";

import { useAuth } from "@/lib/client/authProvider";
import { Box, Text } from "@chakra-ui/react";

export default function Profile() {
  const { user, session, isLoading, error, authenticated } = useAuth();
  console.log(user, session, error, isLoading, authenticated);

  if (isLoading) {
    return <Box pt={"68px"}>...loading</Box>;
  }

  return (
    <Box pt={"68px"} display={"flex"} justifyContent={"center"}>
      <Box p={"10px"}>hello {user?.name}</Box>
    </Box>
  );
}
