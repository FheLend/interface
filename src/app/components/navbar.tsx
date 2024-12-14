"use client";

import { Box, Center, Flex } from "@chakra-ui/react";
import Image from "next/image";
import logo from "@/images/felend.svg";
import ConnectButton from "@/common/connect-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChainSelector from "./chainSelector";
import { useAccount } from "wagmi";
import { WHITE_LIST } from "@/constants/contracts";

function Navbar() {
  const pathname = usePathname();
  const { address } = useAccount();

  const links = [
    {
      name: "Borrow / Lend",
      href: "/lending",
      comingSoon: false,
      target: "_self",
      show: "base",
    },
    {
      name: "Portfolio",
      href: "/portfolio",
      comingSoon: false,
      target: "_self",
      show: "base",
    },
    {
      name: "Faucet",
      href: "/faucet",
      comingSoon: false,
      target: "_self",
      show: "base",
    },
    {
      name: "Documentation",
      href: "https://docs.felend.xyz",
      comingSoon: false,
      show: "lg",
      target: "_blank",
    },
    {
      name: "Settings",
      href: "/settings",
      comingSoon: false,
      show: "base",
      onlyAdmin: true,
      // address &&
      // WHITE_LIST.find((a) => a.toLowerCase() === address.toLowerCase()),
    },
  ];

  return (
    <Flex px="10" py="5" alignItems="center">
      <Box as={Link} href="https://felend.xyz" mr="5">
        <Image src={logo} alt="logo" />
      </Box>

      {links.map((link) => {
        if (
          link.onlyAdmin &&
          (!address ||
            !WHITE_LIST.find((a) => a.toLowerCase() === address.toLowerCase()))
        ) {
          return null;
        }
        return (
          <Center
            as={Link}
            key={link.name}
            href={link.href}
            opacity={pathname === link.href ? 1 : 0.6}
            mx="3"
            display={{ base: "none", [link.show]: "flex" }}
            target={link.target}
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
