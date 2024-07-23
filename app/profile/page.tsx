"use client";

import { useAuth } from "@/lib/client/authProvider";
import { Box, Text } from "@chakra-ui/react";
import Logout from "../components/logout";

export default function Profile() {
  const { user, session, isLoading, error, authenticated } = useAuth();
  console.log(user, session);

  if (isLoading) {
    return <Box pt={"68px"}>...loading</Box>;
  }

  return (
    <Box
      pt={"68px"}
      flexDirection={"column"}
      display={"flex"}
      alignItems={"center"}
    >
      <Box p={"10px"}>hello {user?.name}</Box>
      <Logout />
    </Box>
  );
}
