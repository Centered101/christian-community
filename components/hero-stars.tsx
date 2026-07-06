"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type Star = CSSProperties;

/** ดาวกระพริบ 80 ดวง สร้างฝั่ง client (ตรงกับ createStars() เดิม) */
export default function HeroStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const next: Star[] = [];
    for (let i = 0; i < 80; i++) {
      const size = (Math.random() * 2 + 1).toFixed(1);
      next.push({
        width: `${size}px`,
        height: `${size}px`,
        left: `${(Math.random() * 100).toFixed(2)}%`,
        top: `${(Math.random() * 100).toFixed(2)}%`,
        animationDelay: `${(Math.random() * 4).toFixed(1)}s`,
        // ตัวแปร custom property ที่ .star keyframes ใช้
        ["--dur" as string]: `${(Math.random() * 3 + 2).toFixed(1)}s`,
        ["--fdur" as string]: `${(Math.random() * 6 + 5).toFixed(1)}s`,
      });
    }
    setStars(next);
  }, []);

  return (
    <div id="hero-stars">
      {stars.map((style, i) => (
        <div key={i} className="star" style={style} />
      ))}
    </div>
  );
}
