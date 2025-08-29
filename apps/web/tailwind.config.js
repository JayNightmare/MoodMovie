/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "media",
    theme: {
        extend: {
            colors: {
                accent: "#38bdf8", // light blue
            },
            borderRadius: {
                "2xl": "1rem",
            },
        },
    },
    plugins: [],
};
