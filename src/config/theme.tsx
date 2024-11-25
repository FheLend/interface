import { extendTheme } from "@chakra-ui/react";
import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const colorfulVariant = definePartsStyle((props) => {
  return {
    tab: {
      mr: "2",
      color: "whiteBlue.700",
      fontWeight: 300,
      fontSize: "sm",
      _selected: {
        borderRadius: "lg",
        bg: "primary.600",
        color: "whiteBlue.400",
      },
    },
    tabpanel: {
      px: 0,
    },
  };
});

const variants = {
  basic: colorfulVariant,
};

export const tabsTheme = defineMultiStyleConfig({ variants });

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
    whiteBlue: {
      300: "#F3F6F9",
      400: "#D9E1E9",
      500: "#C3D0DD",
      600: "#9EB0C1",
      700: "#8192A2",
      800: "#6B7D8E",
      900: "#566B7E",
    },
    success: {
      300: "#79D7CF",
    },
  },

  sizes: {
    container: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },

  styles: {
    global: {
      body: {
        minH: "100vh",
        bg: "primary.900",
        color: "whiteBlue.300",
      },
    },
  },
  components: {
    Tabs: tabsTheme,
    Button: {
      sizes: {
        sm: {
          fontSize: "xs",
          minWidth: "80px",
        },
        md: {
          fontSize: "sm",
          minWidth: "100px",
        },
      },
      baseStyle: {
        fontWeight: "normal",
        borderRadius: "xl",
        transition: "0.3s",
      },
      variants: {
        outline: {
          borderColor: "gray.300",
          bgColor: "primary.800",
          color: "white",
          _hover: {
            bgColor: "primary.700",
          },
          _active: {
            bgColor: "primary.700",
          },
        },
        solid: {
          borderColor: "success.300",
          bgColor: "success.300",
          color: "primary.900",
          _hover: {
            bgColor: "#8dd3cd",
            _disabled: {
              bgColor: "#68a39e",
            },
          },
          _active: {
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
    Input: {
      baseStyle: {
        color: "red.900",
      },
      variants: {
        filled: {
          field: {
            borderColor: "primary.600",
            bgColor: "primary.600",
            color: "whiteBlue.400",
            outline: "none",
            boxShadow: "none",
            _hover: {
              bgColor: "primary.500",
              _disabled: {
                bgColor: "primary.800",
              },
            },
            _focusVisible: {
              borderColor: "primary.600",
              bgColor: "primary.500",
            },
          },
        },
      },
    },
  },
});
