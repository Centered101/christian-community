import { getSiteSettings } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import FindChurchSectionForm from "@/components/admin/find-church-section-form";

export const dynamic = "force-dynamic";

export default async function AdminFindChurchPage() {
  const settings = await getSiteSettings();

  return (
    <div className="p-3 sm:p-8 max-w-2xl">
      <AdminPageHeader
        title="ส่วนค้นหาโบสถ์ (หน้าแรก)"
        subtitle="แก้รูปพื้นหลัง ข้อความ เวลา และปุ่มในบล็อกค้นหาโบสถ์"
      />
      <div className="rounded-2xl p-5 sm:p-8" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
        <FindChurchSectionForm settings={settings} />
      </div>
    </div>
  );
}
