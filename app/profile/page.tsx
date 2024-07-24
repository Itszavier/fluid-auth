"use client";

import { useAuth } from "@/lib/client/authProvider";
import { Box, Text } from "@chakra-ui/react";
import Logout from "../components/logout";

export default function Profile() {
  const { auth, isLoading } = useAuth();

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
      <Box
        mt={"20px"}
        p={"10px"}
        width={"530px"}
        boxShadow={"md"}
        borderRadius={"10px"}
      >
        hello {auth.user?.name}
        <Box mt={"8px"}>
          <Logout />
        </Box>
      </Box>
    </Box>
  );
}
