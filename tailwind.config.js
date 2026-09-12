/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#000000",
        "on-primary": "#ffffff",
        "primary-container": "#131b2e",
        "on-primary-container": "#7c839b",
        "primary-fixed": "#dae2fd",
        "primary-fixed-dim": "#bec6e0",
        "on-primary-fixed": "#131b2e",
        "on-primary-fixed-variant": "#3f465c",
        "inverse-primary": "#bec6e0",

        "secondary": "#a23f0f",
        "on-secondary": "#ffffff",
        "secondary-container": "#fe8450",
        "on-secondary-container": "#6c2400",
        "secondary-fixed": "#ffdbce",
        "secondary-fixed-dim": "#ffb598",
        "on-secondary-fixed": "#370e00",
        "on-secondary-fixed-variant": "#7f2b00",

        "tertiary": "#000000",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#2f1500",
        "on-tertiary-container": "#c76c00",
        "tertiary-fixed": "#ffdcc3",
        "tertiary-fixed-dim": "#ffb77d",
        "on-tertiary-fixed": "#2f1500",
        "on-tertiary-fixed-variant": "#6e3900",

        "surface": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-bright": "#f8f9ff",
        "surface-tint": "#565e74",
        "surface-variant": "#d3e4fe",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",

        "on-surface": "#0b1c30",
        "on-surface-variant": "#45464d",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "background": "#f8f9ff",
        "on-background": "#0b1c30",

        "outline": "#76777d",
        "outline-variant": "#c6c6cd",

        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "space-2xs": "0.25rem",
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        "space-2xl": "3rem",
        "space-3xl": "4rem",
        "max-content-width": "1440px",
        "gutter-desktop": "1.5rem",
        "gutter-mobile": "1rem"
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "display": ["Plus Jakarta Sans", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "sans-serif"],
        "title-md": ["Plus Jakarta Sans", "sans-serif"],
        "display-lg": ["Plus Jakarta Sans", "sans-serif"],
        "headline-xl": ["Plus Jakarta Sans", "sans-serif"],
        "headline-xl-mobile": ["Plus Jakarta Sans", "sans-serif"],
        "caption": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "display-lg-mobile": ["Plus Jakarta Sans", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-sm": ["Plus Jakarta Sans", "sans-serif"],
        "label-md": ["Inter", "sans-serif"]
      },
      fontSize: {
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "20px", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "title-md": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-xl": ["32px", { lineHeight: "40px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-xl-mobile": ["26px", { lineHeight: "34px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "caption": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "body-md": ["15px", { lineHeight: "24px", fontWeight: "400" }],
        "display-lg-mobile": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }]
      }
    }
  },
  plugins: []
};
