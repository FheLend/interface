"use client";

import { Box, Center, Flex } from "@chakra-ui/react";
import Image from "next/image";
import logo from "@/images/felend.svg";
import ConnectButton from "@/common/connect-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChainSelector from "./chainSelector";

const links = [
  { name: "Dashboard", href: "/dashboard", comingSoon: false, show: "base" },
  { name: "Faucet", href: "/faucet", comingSoon: false, show: "base" },
  { name: "Document", href: "/document", comingSoon: true, show: "lg" },
];

function Navbar() {
  const pathname = usePathname();

  return (
    <Flex px="10" py="5" alignItems="center">
      <Box as={Link} href="/" mr="5">
        <Image src={logo} alt="logo" />
      </Box>

      {links.map((link) => {
        return (
          <Center
            as={Link}
            key={link.name}
            href={link.href}
            opacity={pathname === link.href ? 1 : 0.6}
            mx="3"
            display={{ base: "none", [link.show]: "flex" }}
          >
            {link.name}
            {link.comingSoon && (
              <Box fontSize="xs" ml="1">
                (coming soon)
              </Box>
            )}
          </Center>
        );
      })}
      <Center
        ml="auto"
        pos={{ base: "fixed", lg: "static" }}
        bottom="0"
        left="0"
        w={{ base: "100%", lg: "auto" }}
        p={{ base: "3", lg: "0" }}
        justifyContent="flex-end"
        bgColor="primary.900"
        zIndex="1"
      >
        <ConnectButton />
        <ChainSelector />
      </Center>
    </Flex>
  );
}

export default Navbar;
