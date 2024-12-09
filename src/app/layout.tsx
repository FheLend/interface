import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config/web3modal";
import Web3ModalProvider from "@/context/web3modal";
import { headers } from "next/headers";
import { Provider as ChakraProvider } from "@/context/chakra-ui";
import ProgressBarProvider from "@/context/nprogress";
import FhenixProvider from "@/context/fhenix";
import { Container } from "@chakra-ui/react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import FeedBack from "./components/feedback";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FetchData from "./components/fetcher";

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
                <FetchData />
                <Navbar />
                <Container maxW="container.2xl">
                  {/* <Notice /> */}
                  {children}
                </Container>
                <FeedBack />
                <Footer />
              </ProgressBarProvider>
            </ChakraProvider>
          </FhenixProvider>
        </Web3ModalProvider>

        <Analytics />
        <SpeedInsights />
        <script
          defer
          src="https://umami.felend.xyz/script.js"
          data-website-id="e15e63b1-d20b-4148-8f7e-08701c50d088"
        ></script>
      </body>
    </html>
  );
}
