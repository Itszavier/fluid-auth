import { Box, Text } from "@chakra-ui/react";

export default function Navbar() {
  return (
    <Box
      w={"100%"}
      padding={"18px"}
      bg={"black"}
      color={"white"}
      display={"flex"}
      alignItems={"center"}
      position={"fixed"}
      h="68px"
      top={"0"}
    >
      <Box>
        <Text fontSize={"20px"}>FluidAuth</Text>
      </Box>
    </Box>
  );
}
