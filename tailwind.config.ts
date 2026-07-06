import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  future: {
    // ทำให้ทุก utility `hover:` ใช้ได้เฉพาะอุปกรณ์ที่รองรับ hover จริง
    // (เมาส์/trackpad) — ป้องกันปัญหา "hover ค้าง" หลังแตะบนมือถือทั้งแอป
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
