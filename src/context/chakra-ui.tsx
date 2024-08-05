// app/providers.tsx
"use client";

import { theme } from "@/config/theme";
import { ChakraProvider } from "@chakra-ui/react";

export function Provider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
