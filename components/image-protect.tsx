"use client";

import { useEffect } from "react";

/** บล็อกคลิกขวาและการลากรูปสำหรับ <img> ทุกตัวในเว็บ */
export default function ImageProtect() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.tagName === "IMG") e.preventDefault();
    };
    const onDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement | null)?.tagName === "IMG") e.preventDefault();
    };
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return null;
}
