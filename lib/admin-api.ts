/** ฟังก์ชันช่วยฝั่ง client สำหรับเรียก /api/admin/[table] CRUD (ใช้ service-role ข้าม RLS) */

export async function adminCreate(table: string, payload: Record<string, unknown>) {
  const res = await fetch(`/api/admin/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "บันทึกไม่สำเร็จ");
  return json.data;
}

export async function adminUpdate(table: string, id: string, payload: Record<string, unknown>) {
  const res = await fetch(`/api/admin/${table}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "บันทึกไม่สำเร็จ");
}

export async function adminDelete(table: string, id: string) {
  const res = await fetch(`/api/admin/${table}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "ลบไม่สำเร็จ");
  }
}

export async function adminSetFeatured(table: string, id: string) {
  const res = await fetch(`/api/admin/${table}/${id}/feature`, { method: "POST" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "ตั้งเป็นหลักไม่สำเร็จ");
  }
}

export async function adminClearAll(table: string) {
  const res = await fetch(`/api/admin/${table}/clear`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "ลบทั้งหมดไม่สำเร็จ");
  }
}
