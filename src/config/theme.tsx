import { extendTheme, transition } from "@chakra-ui/react";

export const theme = extendTheme({
  initialColorMode: "dark",
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
        color: "#F3F6F9",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "normal",
        borderRadius: "xl",
        transition: "0.3s",
      },
      variants: {
        outline: {
          fontSize: "sm",
          minWidth: "100px",
          borderColor: "#79D7CF",
          bgColor: "primary.800",
          color: "#79D7CF",
          _hover: {
            bgColor: "primary.500",
          },
        },
        solid: {
          fontSize: "sm",
          minWidth: "100px",
          borderColor: "#79D7CF",
          bgColor: "#79D7CF",
          color: "primary.900",
          _hover: {
            bgColor: "#8dd3cd",
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        overlay: {},
        dialog: { color: "whiteAlpha.800", bg: "primary.800" },
      },
    },
  },
});
