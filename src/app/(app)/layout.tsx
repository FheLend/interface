import Navbar from "./components/navbar";
import { Container } from "@chakra-ui/react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Container maxW="container.2xl">{children}</Container>
    </>
  );
}
