import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import logo from "@/images/felend.svg";
import ConnectButton from "./ConnectButton";

function Navbar() {
  return (
    <Flex px="10" py="5" color="red.300">
      <Image src={logo} alt="logo" />

      <Box ml="auto">
        <ConnectButton />
      </Box>
    </Flex>
  );
}

export default Navbar;
