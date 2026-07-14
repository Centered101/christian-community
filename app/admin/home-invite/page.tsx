import { getSiteSettings } from "@/lib/data";
import AdminPageHeader from "@/components/admin/page-header";
import HomeInviteSectionForm from "@/components/admin/home-invite-section-form";

export const dynamic = "force-dynamic";

export default async function AdminHomeInvitePage() {
  const settings = await getSiteSettings();

  return (
    <div className="p-3 sm:p-8 max-w-2xl">
      <AdminPageHeader
        title="คำเชิญท้ายหน้าแรก"
        subtitle="แก้ quote สีฟ้าและปุ่มคำเชิญด้านล่างของหน้าแรก"
      />
      <div className="rounded-2xl p-5 sm:p-8" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
        <HomeInviteSectionForm settings={settings} />
      </div>
    </div>
  );
}
