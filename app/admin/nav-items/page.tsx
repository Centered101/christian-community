import { getNavItems } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import NavItemsListClient from "@/components/admin/nav-items-list-client";

export const dynamic = "force-dynamic";

export default async function AdminNavItemsPage() {
  let items: Awaited<ReturnType<typeof getNavItems>> = [];
  try {
    items = await getNavItems();
  } catch {}

  return (
    <div className="p-8">
      <AdminPageHeader title="เมนูนำทาง (Navbar)" subtitle="เรียงลำดับ เปลี่ยนชื่อ หรือซ่อน/แสดงเมนูหลัก" />
      <NavItemsListClient initialItems={items} />
    </div>
  );
}
