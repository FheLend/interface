import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  SimpleGrid,
  Text,
  TextProps,
} from "@chakra-ui/react";
import Image from "next/image";
import logo from "@/images/felend.svg";
import background from "@/images/background.png";
import earthIcon from "@/images/landing-page/earth.svg";
import peopleIcon from "@/images/landing-page/people.svg";
import networkIcon from "@/images/landing-page/network.svg";
import bankerIcon from "@/images/landing-page/banker.svg";
import debtIcon from "@/images/landing-page/debt.svg";
import xIcon from "@/images/x.svg";
import XXX from "@/images/x.svg";
import telegramIcon from "@/images/telegram.svg";
import discordIcon from "@/images/discord.svg";
import Link from "next/link";

const links = [
  { name: "Dashboard", href: "/dashboard", comingSoon: false, show: "base" },
  { name: "Faucet", href: "/faucet", comingSoon: false, show: "base" },
  { name: "Document", href: "/document", comingSoon: true, show: "lg" },
];

function GradientText(props: TextProps) {
  return (
    <Text
      as="h2"
      bgGradient="linear(to-r, #e9e9e9, #8d8d8d)"
      bgClip="text"
      fontSize="x-large"
      fontWeight="semibold"
      display="inline-block"
      {...props}
    />
  );
}

function Home() {
  return (
    <Box bg={`url(${background.src})`} bgSize="cover" minH="100vh">
      <Flex px={{ base: 5, md: 10 }} py="5" alignItems="center">
        <Box as={Link} href="/" mr="5">
          <Image src={logo} alt="logo" />
        </Box>

        {links.map((link) => {
          return (
            <Center
              color="whiteAlpha.600"
              as={Link}
              key={link.name}
              href={link.href}
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
        <Center ml="auto" display={{ base: "none", md: "flex" }}>
          <Button as={Link} href="/dashboard" variant="outline">
            Launch app
          </Button>
        </Center>
      </Flex>

      <Container maxW="container.md" minH="calc(100vh - 80px)" display="flex">
        <Center flexDir="column" textAlign={{ md: "center" }}>
          <GradientText
            fontSize={{ base: "xx-large", md: "xxx-large" }}
            fontWeight={{ base: "semibold", md: "bold" }}
          >
            Empowering Confidential and Secure Crypto Lending
          </GradientText>
          <Text color="whiteAlpha.700" px={{ md: 10 }} my="7" lineHeight="30px">
            Felend is a pioneering lending protocol powered by Fully Homomorphic
            Encryption (FHE). We provide a secure way to lend and borrow crypto
            assets while ensuring that your financial details remain completely
            confidential. With Felend, whether you’re lending or borrowing, your
            sensitive information is protected while you benefit from the full
            potential of DeFi
          </Text>
          <Button
            as={Link}
            href="/dashboard"
            w="200px"
            alignSelf={{ base: "flex-start", md: "center" }}
          >
            Launch App
          </Button>
        </Center>
      </Container>

      <Container maxW="container.lg" mt="20">
        <Flex flexDir={{ base: "column", md: "row" }}>
          <Image src={earthIcon} alt="felend-icon" />
          <Box
            px={{ base: 0, md: 20 }}
            mt={{ base: 5, md: 0 }}
            ml={{ base: 0, md: 10 }}
          >
            <GradientText>Security and Confidentiality First</GradientText>
            <Text
              color="whiteAlpha.700"
              lineHeight="24px"
              mt="3"
              fontWeight="300"
            >
              Unlike traditional DeFi platforms that often expose user data to
              risks, Felend uses advanced FHE technology to keep your
              information secure. By encrypting your data, Felend ensures that
              your financial activities remain confidential without sacrificing
              the transparency and efficiency that blockchain offers. This makes
              Felend the ideal choice for institutions, liquid funds, and users
              who prioritize security and confidentiality. This ensures that you
              enjoy both privacy and full functionality.
            </Text>
          </Box>
        </Flex>
        <Flex mt="20" flexDir={{ base: "column", md: "row" }}>
          <Image src={peopleIcon} alt="felend-icon" />
          <Box
            px={{ base: 0, md: 20 }}
            mt={{ base: 5, md: 0 }}
            ml={{ base: 0, md: 10 }}
          >
            <GradientText>Fair Lending</GradientText>
            <Text
              color="whiteAlpha.700"
              lineHeight="24px"
              mt="3"
              fontWeight="300"
            >
              Felend safeguards against exploitation by concealing sensitive
              borrower details, such as liquidation prices and collateral
              amounts, thereby preventing common liquidation attacks seen in
              other lending protocols. With FHE, Felend offers top-tier
              security, enabling encrypted data processing through an intuitive
              platform that provides the best user experience.
            </Text>
          </Box>
        </Flex>
        <Flex mt="20" flexDir={{ base: "column", md: "row" }}>
          <Image src={networkIcon} alt="felend-icon" />
          <Box
            px={{ base: 0, md: 20 }}
            mt={{ base: 5, md: 0 }}
            ml={{ base: 0, md: 10 }}
          >
            <GradientText>Cross-Chain Lending (Upcoming)</GradientText>
            <Text
              color="whiteAlpha.700"
              lineHeight="24px"
              mt="3"
              fontWeight="300"
            >
              Felend&apos;s cross-chain lending mechanism ensures that your
              collateral remains confidentially on the Fhenix chain, protecting
              against liquidation attacks. Simultaneously, the borrowing asset
              can be seamlessly accessed on Ethereum or other EVM-compatible L2
              networks. This innovative approach allows you to engage in DeFi
              across various blockchains without compromising security or
              fairness.
            </Text>
          </Box>
        </Flex>
      </Container>

      <Container maxW="container.xl" mt={{ base: "100px", md: "300px" }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={20}>
          <Box>
            <Image src={bankerIcon} alt="felend-icon" />
            <Box mt="10">
              <GradientText>For Lenders</GradientText>
              <Text
                color="whiteAlpha.700"
                lineHeight="24px"
                mt="3"
                fontWeight="300"
              >
                Earn interest on your crypto assets securely, with no need to
                disclose your portfolio details. Felend maximizes your returns
                while ensuring your financial confidentiality.
              </Text>
            </Box>
          </Box>
          <Box>
            <Image src={debtIcon} alt="felend-icon" />
            <Box mt="10">
              <GradientText>For Borrowers</GradientText>
              <Text
                color="whiteAlpha.700"
                lineHeight="24px"
                mt="3"
                fontWeight="300"
              >
                Felend offers a secure environment to keep your lending details
                confidential. Whether you&apos;re an institution, a liquid fund,
                or an individual prioritizing security, Felend protects your
                sensitive information.
              </Text>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>

      <Box mt={{ base: "100px", md: "300px" }} textAlign="center">
        <GradientText fontSize="xx-large" fontWeight="bold">
          Join with us
        </GradientText>
        <Center mt={{ base: 10, md: 20 }} gridGap={20}>
          <Image src={discordIcon} alt="felend-icon" />
          <Image src={telegramIcon} alt="felend-icon" />
          <Image src={xIcon} alt="felend-icon" />
        </Center>
      </Box>

      <Box color="whiteAlpha.700" bgColor="whiteAlpha.100" py="5" mt="100">
        <Container as={Flex} maxW="container.2xl" justify="space-between">
          <Box>Felend © 2024</Box>

          <Flex gridGap={4} filter="grayscale(100%)">
            <Image src={discordIcon} width={24} alt="felend-icon" />
            <Image src={telegramIcon} width={24} alt="felend-icon" />
            <Image src={xIcon} width={24} alt="felend-icon" />
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
