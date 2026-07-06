"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type UploadLockContextValue = {
  isUploading: boolean;
  lock: () => void;
  unlock: () => void;
};

const UploadLockContext = createContext<UploadLockContextValue | null>(null);

/**
 * แชร์สถานะ "กำลังอัปโหลดรูป/ไฟล์อยู่" ให้ทั้งหน้า admin เพื่อ:
 * - ล็อกลิงก์เมนู/ปุ่มอื่นๆ ที่พาออกจากหน้าไม่ให้กดได้ระหว่างอัปโหลด
 * - เตือนก่อนปิดแท็บ/รีโหลดหน้าถ้ายังอัปโหลดไม่เสร็จ
 * ใช้ตัวนับ (ไม่ใช่ boolean เดี่ยว) เผื่อกรณีมี ImageUpload มากกว่าหนึ่งจุดในหน้าเดียว
 */
export function AdminUploadLockProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  const lock = useCallback(() => {
    countRef.current += 1;
    setCount(countRef.current);
  }, []);

  const unlock = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    setCount(countRef.current);
  }, []);

  const isUploading = count > 0;

  useEffect(() => {
    if (!isUploading) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isUploading]);

  return (
    <UploadLockContext.Provider value={{ isUploading, lock, unlock }}>
      {children}
    </UploadLockContext.Provider>
  );
}

export function useUploadLock() {
  const ctx = useContext(UploadLockContext);
  if (!ctx) throw new Error("useUploadLock must be used within AdminUploadLockProvider");
  return ctx;
}
