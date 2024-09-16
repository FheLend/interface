"use client";

import { Box, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { BsFillChatSquareTextFill } from "react-icons/bs";

function FeedBack() {
  return (
    <Box
      pos="fixed"
      bottom="70px"
      right="10"
      cursor="pointer"
      as={Link}
      href="https://forms.gle/avZ5Wgypp2WvcJVEA"
      textAlign="center"
      transition="0.3s"
      color="whiteAlpha.600"
      target="_blank"
      _hover={{ bottom: "75px", color: "white" }}
    >
      <Icon
        as={BsFillChatSquareTextFill}
        boxSize="30px"
        color="whiteBlue.500"
      />
      <Text fontSize="sm">Feedback</Text>
    </Box>
  );
}

export default FeedBack;
