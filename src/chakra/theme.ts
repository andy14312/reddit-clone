import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";

export const theme = extendTheme({
  colors: {
    brand: {
      100: "#ff3c00", // reddit brand color
    },
  },
  fonts: {
    body: "Open Sans, sans-serif",
  },
  styles: {
    global: {
      body: {
        backgroundColor: "gray.200",
      },
    },
  },
  components: {
    Button,
  },
});
