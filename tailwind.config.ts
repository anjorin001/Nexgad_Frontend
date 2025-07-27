// // tailwind.config.ts
// import type { Config } from 'tailwindcss'

// const config: Config = {
//   content: [
//     './index.html',
//     './src/**/*.{js,ts,jsx,tsx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: '#1B3C53',      // For buttons and small components
//         secondary: '#F9F3EF',    // Light background for cards etc.
//         mainbg: '#456882',       // Main page background
//         white: '#FFFFFF',        // Optional override
//       },
//     },
//   },
//   plugins: [],
// }

// export default config

// tailwind.config.ts
import { type Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        'sidebar-primary': '#1B3C53',
        'sidebar-primary-foreground': '#CBDCEB',
        'sidebar-hover': '#456882',
      },
    },
  },
  // If using shadcn
  // darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  plugins: [],
};
export default config;
