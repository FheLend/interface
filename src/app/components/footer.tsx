import { Box, Container, Flex, Link } from "@chakra-ui/react";
import Image from "next/image";
import xIcon from "@/images/x.svg";
import telegramIcon from "@/images/telegram.svg";
import discordIcon from "@/images/discord.svg";

function Footer() {
  return (
    <Box
      color="whiteBlue.600"
      bgColor="primary.800"
      py="4"
      pos="sticky"
      top="100vh"
      mt="10"
    >
      <Container as={Flex} maxW="container.2xl" justify="space-between">
        <Box>Felend © 2024</Box>

        <Flex gridGap={4} filter="grayscale(100%)">
          <Link href="https://discord.gg/KmvbNJC3wa" isExternal>
            <Image src={discordIcon} width={24} alt="felend-icon" />
          </Link>
          <Link href="https://t.me/felendxyz" isExternal>
            <Image src={telegramIcon} width={24} alt="felend-icon" />
          </Link>
          <Link href="https://x.com/felendxyz" isExternal>
            <Image src={xIcon} width={24} alt="felend-icon" />
          </Link>
        </Flex>
      </Container>
    </Box>
  );
}

export default Footer;
