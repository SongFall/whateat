/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      // Tailwind CSS v4 中正确配置容器最大宽度
      container: {
        maxWidth: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1000px",
          "2xl": "1200px",
        },
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
    },
  },
  plugins: [],
};
