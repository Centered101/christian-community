import { getNavItems } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import NavItemsListClient from "@/components/admin/nav-items-list-client";

export const dynamic = "force-dynamic";

export default async function AdminNavItemsPage() {
  let items: Awaited<ReturnType<typeof getNavItems>> = [];
  let loadError = "";
  try {
    items = await getNavItems();
  } catch (err: unknown) {
    loadError = err instanceof Error ? err.message : "โหลดเมนูไม่สำเร็จ";
  }

  return (
    <div className="p-3 sm:p-8">
      <AdminPageHeader
        title="หน้าเว็บและเมนูนำทาง"
        subtitle="แก้ชื่อ หัวข้อ คำอธิบายของหน้า และเลือกได้ว่าจะให้หน้านั้นอยู่บน Navbar หรือไม่"
      />
      <NavItemsListClient initialItems={items} loadError={loadError} />
    </div>
  );
}
