"use client";

import { Box, Icon } from "@chakra-ui/react";
import Link from "next/link";
import { BsFillChatSquareTextFill } from "react-icons/bs";

function FeedBack() {
  return (
    <Box pos="fixed" bottom="20" right="10" cursor="pointer" as={Link} href="#">
      <Icon
        as={BsFillChatSquareTextFill}
        boxSize="30px"
        color="whiteBlue.500"
      />
    </Box>
  );
}

export default FeedBack;
