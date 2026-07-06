export type UploadResult = {
  url: string;
  path: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
};

export type UploadProgressPhase = "uploading" | "processing";

type UploadFileOpts = {
  signal?: AbortSignal;
  onProgress?: (percent: number, phase: UploadProgressPhase) => void;
};

/**
 * ใช้ XMLHttpRequest แทน fetch เพื่ออ่านความคืบหน้าการส่งไฟล์จริง (upload.onprogress)
 * — fetch ไม่มี event ความคืบหน้าฝั่งส่งข้อมูลออกให้ใช้
 */
export function uploadFile(
  folder: string,
  file: File,
  mode: "image" | "raw" = "raw",
  opts: UploadFileOpts = {}
): Promise<UploadResult> {
  const { signal, onProgress } = opts;

  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    form.append("mode", mode);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const percent = Math.round((e.loaded / e.total) * 100);
      onProgress?.(percent, percent >= 100 ? "processing" : "uploading");
    };

    xhr.onload = () => {
      let json: { url?: string; path?: string; error?: string } = {};
      try {
        json = JSON.parse(xhr.responseText);
      } catch {
        // ignore parse error, handled by status check below
      }
      if (xhr.status >= 200 && xhr.status < 300 && json.url && json.path) {
        resolve(json as UploadResult);
      } else {
        reject(new Error(json.error ?? "อัปโหลดไม่สำเร็จ"));
      }
    };

    xhr.onerror = () => reject(new Error("อัปโหลดไม่สำเร็จ — เชื่อมต่อล้มเหลว"));
    xhr.onabort = () => reject(new DOMException("Upload cancelled", "AbortError"));

    if (signal) {
      if (signal.aborted) {
        xhr.abort();
        return;
      }
      signal.addEventListener("abort", () => xhr.abort(), { once: true });
    }

    xhr.send(form);
  });
}

export async function uploadFromUrl(
  folder: string,
  url: string,
  opts: { signal?: AbortSignal } = {}
): Promise<UploadResult> {
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, url }),
    signal: opts.signal,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "อัปโหลดไม่สำเร็จ");
  return json as UploadResult;
}

export async function deleteFileByUrl(url: string): Promise<void> {
  if (!url) return;
  await fetch("/api/admin/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  }).catch(() => {});
}

/**
 * ลบไฟล์เก่าที่ถูกแทนที่แล้ว — เรียกใช้ "หลังจาก" บันทึกข้อมูลลง database สำเร็จเท่านั้น
 * เพื่อไม่ให้ไฟล์เดิมหายไปก่อนที่จะรู้ว่าการอัปเดตสำเร็จจริง
 */
export function cleanupReplacedFile(previousUrl: string | undefined | null, nextUrl: string): void {
  if (previousUrl && previousUrl !== nextUrl) {
    void deleteFileByUrl(previousUrl);
  }
}
