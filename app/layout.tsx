import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config";
import Web3ModalProvider from "@/context/web3modal";
import { headers } from "next/headers";
import Navbar from "./components/navbar";
import { Provider as ChakraProvider } from "./context/chakra-ui";

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
          <ChakraProvider>
            <Navbar />
            {children}
          </ChakraProvider>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
