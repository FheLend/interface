import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    primary: {
      100: "#3277AA",
      200: "#1E5B88",
      300: "#1E4766",
      400: "#1F3D53",
      500: "#1E3443",
      600: "#1D2E3A",
      700: "#1A242C",
      800: "#171F25",
      900: "#111518",
    },
  },

  styles: {
    global: {
      body: {
        bg: "primary.900",
        color: "white",
      },
    },
  },
});
