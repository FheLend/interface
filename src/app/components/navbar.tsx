"use client";

import { Box, Center, Flex } from "@chakra-ui/react";
import Image from "next/image";
import logo from "@/images/felend.svg";
import ConnectButton from "../../common/connect-button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/", comingSoon: false },
  { name: "Faucet", href: "/faucet", comingSoon: false },
  { name: "Document", href: "/document", comingSoon: true },
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
      <Box ml="auto">
        <ConnectButton />
      </Box>
    </Flex>
  );
}

export default Navbar;
