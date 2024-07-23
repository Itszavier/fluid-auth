/** @format */

import Image from "next/image";
import styles from "./page.module.css";
import { LoginButton } from "./components/buttons";
import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Divider,
  Text,
} from "@chakra-ui/react";
import Login from "./components/login";

export default function Home() {
  return (
    <Box
      as="main"
      pt={"68px"}
      display={"flex"}
      justifyContent={"center"}
      height={"100dvh"}
      bg={"gray.100"}

      //  bgGradient="linear(800deg, #ff9a9e, #fad0c4)"
    >
      <Login />
    </Box>
  );
}
