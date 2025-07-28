import { type Config } from "tailwindcss";
import scrollbar from "tailwind-scrollbar";

const config: Config = {
  theme: {
    extend: {
      colors: {
        "sidebar-primary": "#1B3C53",
        "sidebar-primary-foreground": "#CBDCEB",
        "sidebar-hover": "#456882",
      },
    },
  },
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  plugins: [scrollbar({ nocompatible: true })],
};
export default config;
