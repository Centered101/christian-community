import sharp, { type Metadata, type OutputInfo } from "sharp";
import { fileTypeFromBuffer } from "file-type";
import { assertSafeSvg, looksLikeSvg } from "./svg-sanitize";

const ALLOWED_RASTER_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

const MAX_INPUT_BYTES = 8 * 1024 * 1024;
const MAX_INPUT_DIMENSION = 6000;
const OUTPUT_MAX_DIMENSION = 2400;

export type ProcessedImage = {
  buffer: Buffer;
  width: number;
  height: number;
  format: "webp" | "avif";
  size: number;
};

export type ProcessImageOptions = {
  /** เข้ารหัสเป็น avif แทนค่าเริ่มต้น webp */
  preferAvif?: boolean;
};

/**
 * ตรวจสอบและแปลง buffer รูปภาพ (จากการอัพโหลดหรือดาวน์โหลดจาก URL) ให้เป็น
 * webp/avif raster ที่ปลอดภัย ไม่ว่าผู้เรียกจะอ้างว่าไฟล์นั้นเป็นอะไรก็ตาม
 * ไม่เชื่อถือชื่อไฟล์เดิมหรือ MIME type ที่แจ้งมา — ตรวจชนิดไฟล์จริงจากเนื้อหาไฟล์เอง
 */
export async function processImage(raw: Buffer, opts: ProcessImageOptions = {}): Promise<ProcessedImage> {
  if (!raw || raw.length === 0) throw new Error("ไฟล์ว่างเปล่า");
  if (raw.length > MAX_INPUT_BYTES) throw new Error("ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 8MB)");

  const isSvg = looksLikeSvg(raw);
  if (isSvg) {
    assertSafeSvg(raw.toString("utf8"));
  } else {
    const detected = await fileTypeFromBuffer(raw);
    if (!detected || !ALLOWED_RASTER_MIME.has(detected.mime)) {
      throw new Error("ชนิดไฟล์ไม่รองรับ (รองรับ JPG, PNG, WEBP, AVIF, SVG เท่านั้น)");
    }
  }

  // SVG จะถูกแปลงเป็นภาพ raster ตรงนี้ — เนื้อหา vector/script ต้นฉบับจะไม่ถูก
  // เก็บหรือให้บริการเลย ซึ่งเป็นสิ่งที่ทำให้ script ที่แฝงมาไม่มีผลอะไร
  const source = isSvg ? sharp(raw, { density: 300 }) : sharp(raw, { failOn: "error" });

  let metadata: Metadata;
  try {
    metadata = await source.metadata();
  } catch {
    throw new Error("ไฟล์รูปภาพเสียหายหรือเปิดไม่ได้");
  }
  if (!metadata.width || !metadata.height) throw new Error("ไม่สามารถอ่านขนาดรูปภาพได้");
  if (metadata.width > MAX_INPUT_DIMENSION || metadata.height > MAX_INPUT_DIMENSION) {
    throw new Error(`รูปภาพมีขนาดกว้าง/สูงเกินกำหนด (สูงสุด ${MAX_INPUT_DIMENSION}px)`);
  }

  const resized = source.clone().resize({
    width: OUTPUT_MAX_DIMENSION,
    height: OUTPUT_MAX_DIMENSION,
    fit: "inside",
    withoutEnlargement: true,
  });

  const format: ProcessedImage["format"] = opts.preferAvif ? "avif" : "webp";
  let output: { data: Buffer; info: OutputInfo };
  try {
    output =
      format === "avif"
        ? await resized.avif({ quality: 70 }).toBuffer({ resolveWithObject: true })
        : await resized.webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
  } catch {
    throw new Error("ไม่สามารถแปลงไฟล์รูปภาพได้");
  }

  return {
    buffer: output.data,
    width: output.info.width,
    height: output.info.height,
    format,
    size: output.data.length,
  };
}
