"use client";

import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import logo from "@/images/felend.svg";
import ConnectButton from "./connectButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/" },
  {
    name: "Market",
    href: "/market",
  },
  { name: "Document", href: "/document" },
];

function Navbar() {
  const pathname = usePathname();

  return (
    <Flex px="10" py="5" alignItems="center">
      <Box as={Image} src={logo} alt="logo" mr="5" />

      {links.map((link) => {
        return (
          <Box
            as={Link}
            key={link.name}
            href={link.href}
            opacity={pathname === link.href ? 0.9 : 0.6}
            mx="3"
          >
            {link.name}
          </Box>
        );
      })}
      <Box ml="auto">
        <ConnectButton />
      </Box>
    </Flex>
  );
}

export default Navbar;
