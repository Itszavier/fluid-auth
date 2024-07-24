/** @format */

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
      bg={"gray.100"}
      height={"100vh"}
    >
      <Box mt={"20px"} p={"10px"} width={"530px"} bg={"gray.200"} borderRadius={"1px"}>
        name: {auth.user?.name}
        <Box mt={"8px"}>
          <Logout />
        </Box>
      </Box>
      
      <Box mt={"20px"} p={"10px"} width={"530px"} bg={"gray.200"} borderRadius={"1px"}>
        {JSON.stringify(auth)}
      </Box>
    </Box>
  );
}
