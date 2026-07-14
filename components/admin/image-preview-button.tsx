"use client";

import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt?: string;
  title?: string;
  className: string;
  imageClassName?: string;
};

export default function ImagePreviewButton({ src, alt = "", title = "ดูรูป", className, imageClassName = "object-cover" }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={title}
        className={`${className} overflow-hidden bg-transparent p-0 transition-opacity hover:opacity-85 active:scale-95`}
      >
        <img src={src} className={`h-full w-full max-w-none ${imageClassName}`} alt={alt} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 active:scale-95"
            aria-label="ปิดรูปตัวอย่าง"
          >
            x
          </button>
          <img
            src={src}
            className="max-h-[80vh] max-w-[90vw] rounded-2xl object-contain shadow-[0_0_60px_rgba(147,197,253,0.3)]"
            alt={alt}
          />
        </div>
      )}
    </>
  );
}
