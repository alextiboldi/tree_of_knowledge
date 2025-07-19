const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // Professional fonts for parent-facing interfaces
        parent: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        // Child-friendly fonts for learning interfaces
        child: [
          "Comic Neue",
          "Quicksand",
          "Nunito",
          "Open Sans",
          "system-ui",
          "sans-serif",
        ],
        // Playful display font for headings in child interfaces
        "child-display": [
          "Fredoka One",
          "Quicksand",
          "Nunito",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        // Parent interface typography scale (professional)
        "parent-xs": ["0.75rem", { lineHeight: "1rem" }],
        "parent-sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "parent-base": ["1rem", { lineHeight: "1.5rem" }],
        "parent-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "parent-xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "parent-2xl": ["1.5rem", { lineHeight: "2rem" }],
        "parent-3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "parent-4xl": ["2.25rem", { lineHeight: "2.5rem" }],

        // Child interface typography scale (larger, more readable)
        "child-xs": ["0.875rem", { lineHeight: "1.25rem" }],
        "child-sm": ["1rem", { lineHeight: "1.5rem" }],
        "child-base": ["1.125rem", { lineHeight: "1.75rem" }],
        "child-lg": ["1.25rem", { lineHeight: "1.875rem" }],
        "child-xl": ["1.5rem", { lineHeight: "2rem" }],
        "child-2xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "child-3xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "child-4xl": ["3rem", { lineHeight: "3rem" }],
        "child-5xl": ["3.75rem", { lineHeight: "3.75rem" }],
      },
      letterSpacing: {
        child: "0.025em",
        "child-wide": "0.05em",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
        // Enhanced animations for better UX
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-gentle": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        "bounce-subtle": {
          "0%, 20%, 53%, 80%, 100%": { transform: "translateY(0)" },
          "40%, 43%": { transform: "translateY(-8px)" },
          "70%": { transform: "translateY(-4px)" },
          "90%": { transform: "translateY(-2px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        // Enhanced animations
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 1s ease-in-out",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-gentle": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
