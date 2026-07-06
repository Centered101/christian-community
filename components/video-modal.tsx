"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  src: string;
  title?: string;
};

export default function VideoModal({ open, onClose, src, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (open) {
      void v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [open, src]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      id="video-modal"
      className={open ? "open" : ""}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button id="modal-close" onClick={onClose}>
        ✕
      </button>
      <video key={src} ref={videoRef} controls playsInline title={title}>
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
