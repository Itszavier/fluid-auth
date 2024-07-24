/** @format */

import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

const links: { label: string; link: string }[] = [
  {
    label: "Home",
    link: "/",
  }, 
  
  {
    label: "Profile",
    link: "/profile",
  },
];

export default function Navbar() {
  return (
    <Box
      w={"100%"}
      padding={"18px"}
      bg={"gray.100"}
      zIndex={999}
      color={"black"}
      display={"flex"}
      alignItems={"center"}
      position={"fixed"}
      h="68px"
      top={"0"}
      borderBottom={"1px solid lightgray"}
    >
      <Box>
        <Text fontSize={"20px"}>FluidAuth</Text>
      </Box>

      <Box
        p={"8px"}
        display={"flex"}
        alignItems={"center"}
        flexDirection={"row"}
        gap={"20px"}
        ml={"auto"}
      >
        {links.map((link, index) => {
          return (
            <Link key={index} href={link.link}>
              {link.label}
            </Link>
          );
        })}
      </Box>
    </Box>
  );
}
