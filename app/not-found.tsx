import { Box, Center, Divider } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Center height="calc(100vh - 81px)">
      <Box fontSize="2xl" py="2" px="5" borderRight="1px solid #ddd">
        404
      </Box>
      <Box ml="5">This page could not be found.</Box>
    </Center>
  );
}
