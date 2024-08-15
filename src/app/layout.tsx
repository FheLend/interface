import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config/web3modal";
import Web3ModalProvider from "@/context/web3modal";
import { headers } from "next/headers";
import Navbar from "./components/navbar";
import { Provider as ChakraProvider } from "../context/chakra-ui";
import { Container } from "@chakra-ui/react";
import ProgressBarProvider from "@/context/nprogress";
import FhenixProvider from "@/context/fhenix";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Felend",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Web3ModalProvider initialState={initialState}>
          <FhenixProvider>
            <ChakraProvider>
              <ProgressBarProvider>
                <Navbar />
                <Container maxW="container.xl">{children}</Container>
              </ProgressBarProvider>
            </ChakraProvider>
          </FhenixProvider>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
