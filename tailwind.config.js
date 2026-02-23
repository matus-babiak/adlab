/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ffffff",
        primary: "#FFD700",
        "primary-foreground": "#000000",
        secondary: "#1a1a1a",
        "secondary-foreground": "#ffffff",
        accent: "#00FF80",
        "accent-foreground": "#000000",
        muted: "#262626",
        "muted-foreground": "#b0b0b0",
        card: "#121212",
        "card-foreground": "#ffffff",
        border: "#262626",
        input: "#262626",
        ring: "#FFD700",
        destructive: "#FF6B4A",
        "destructive-foreground": "#ffffff",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      borderRadius: { lg: "1rem", md: "calc(1rem - 2px)", sm: "calc(1rem - 4px)" },
    },
  },
  plugins: [],
};
