/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#e6effb",
          100: "#d9e7f9",
          200: "#b1cef3",
          500: "#0460d9",
          600: "#0456c3",
          700: "#034dae",
          800: "#0348a3",
          900: "#023a82",
          950: "#01224c",
        },

        darkBlue: {
          50: "#e6ecf4",
          100: "#d9e2ee",
          200: "#b1c3db",
          500: "#033e8c",
          600: "#03387e",
          700: "#023270",
          800: "#022f69",
          900: "#022554",
          950: "#011631",
        },

        lightBlue: {
          50: "#eaf3fb",
          100: "#dfedf9",
          200: "#bddaf3",
          500: "#2b88d9",
          600: "#277ac3",
          700: "#226dae",
          800: "#2066a3",
          900: "#1a5282",
          950: "#0f304c",
        },

        orange: {
          50: "#fbf2e9",
          100: "#f9ebde",
          200: "#f3d5bb",
          500: "#d97925",
          600: "#c36d21",
          700: "#ae611e",
          800: "#a35b1c",
          900: "#824916",
          950: "#4c2a0d",
        },

        danger: {
          50: "#fee8e6",
          100: "#fdddda",
          200: "#fbb8b2",
          500: "#f21905",
          600: "#da1705",
          700: "#c21404",
          800: "#b61304",
          900: "#910f03",
          950: "#550902",
        },

        warning: {
          50: "#fef8e8",
          100: "#fdf5dd",
          200: "#fbeab8",
          500: "#f3bb1b",
          600: "#dba818",
          700: "#c29616",
          800: "#b68c14",
          900: "#927010",
          950: "#554109",
        },

        success: {
          50: "#eaf6ec",
          100: "#dff2e3",
          200: "#bce4c5",
          500: "#28a745",
          600: "#24963e",
          700: "#208637",
          800: "#1e7d34",
          900: "#186429",
          950: "#0e3a18",
        },
      },

      fontFamily: {
        title: ['Host Grotesk', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        ui: ['Plus Jakarta Sans', 'sans-serif'],
      },

      fontSize: {
        title: ["96px", { lineHeight: "1" }],
        subtitle: ["64px", { lineHeight: "1" }],
        heading: ["40px", { lineHeight: "1.2" }],
        subheading: ["24px", { lineHeight: "1.4" }],
        body: ["16px", { lineHeight: "1.6" }],
        small: ["12px", { lineHeight: "1.5" }],
      },

      borderRadius: {
        xl2: "20px",
      }
    },
  },
  plugins: [],
}