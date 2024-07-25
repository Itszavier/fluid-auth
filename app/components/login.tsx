"use client";

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
  Button,
} from "@chakra-ui/react";

import { LoginButton } from "./buttons";
import { FormEvent, useState } from "react";
import { SignInWithCredentials } from "@/lib/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await SignInWithCredentials("local", {
        email,
        password,
      });
      console.log(response);
      router.push("/profile");
    } catch (error) {
      console.error("local login", error);
    }
  };

  return (
    <Box
      // bgGradient="linear(to-r, #ff7e5f, #feb47b)"
      mt={"40px"}
      width={"450px"}
      padding={"19px"}
      as="form"
      className={"form"}
      h={"fit-content"}
      onSubmit={handleSubmit}
    >
      <Heading textAlign={"left"} width={"100%"}>
        FluidAuth Demo
      </Heading>
      <Box mt={"25px"} width={"100%"} display={"flex"} flexDirection={"column"}>
        <FormControl mb={"10"}>
          <FormLabel>Email Address</FormLabel>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            bg={"gray.200"}
            m={"0px"}
            type="email"
          />
          <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            bg={"gray.200"}
            m={"0px"}
            type="password"
          />
          <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>
        <Flex mb="8px" justifyContent={"center"}>
          <Button type={"submit"} mt={"25px"} w="100%" colorScheme="blue">
            Login
          </Button>
        </Flex>
        <Flex
          padding={"10px"}
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <Divider flex="1" height="1px" />
          <Text mx={2}>or</Text>
          <Divider flex="1" height="1px" />
        </Flex>
        <Flex mt={"10px"} mb="8px" justifyContent={"center"}>
          <LoginButton label="Google" provider="google" />
        </Flex>
      </Box>
    </Box>
  );
}
