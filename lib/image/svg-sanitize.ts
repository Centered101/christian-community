const DANGEROUS_PATTERNS: RegExp[] = [
  /<\s*script/i,
  /<\s*iframe/i,
  /<\s*foreignobject/i,
  /<\s*embed/i,
  /<\s*object/i,
  /on\w+\s*=/i, // attribute event handler: onload=, onclick=, onerror= ฯลฯ
  /javascript:/i,
  /data:text\/html/i,
  /<!entity/i, // XXE / billion-laughs
  /(?:xlink:href|href)\s*=\s*["']?\s*(https?:)?\/\//i, // ลิงก์อ้างอิงระยะไกลที่จะถูกโหลดตอนแปลงเป็นภาพ (SSRF)
];

/** ปฏิเสธ SVG ที่มี script, event handler, หรือลิงก์อ้างอิงระยะไกล — throw error ถ้าเจอ */
export function assertSafeSvg(svgText: string) {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(svgText)) {
      throw new Error("ไฟล์ SVG มีเนื้อหาที่ไม่ปลอดภัย");
    }
  }
}

export function looksLikeSvg(buffer: Buffer): boolean {
  const head = buffer.subarray(0, 2048).toString("utf8").trim();
  return /^(<\?xml[^>]*>)?\s*(<!doctype[^>]*>)?\s*<svg[\s>]/i.test(head);
}
