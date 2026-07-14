import { getAdminCredentials } from "@/lib/admin-credentials";
import { getSiteSettings } from "@/lib/data";
import AccountSettingsForm from "@/components/admin/account-settings-form";
import SiteSettingsForm from "@/components/admin/site-settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [credentials, siteSettings] = await Promise.all([
    getAdminCredentials(),
    getSiteSettings(),
  ]);

  return (
    <div className="p-3 sm:p-8 max-w-2xl space-y-10">
      <div>
        <h1 className="text-gray-900 text-2xl font-bold mb-8">ตั้งค่า</h1>

        <div className="rounded-2xl p-8 mb-4" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
          <h2 className="text-gray-900 text-lg font-bold mb-1">บัญชีผู้ดูแลระบบ</h2>
          <p className="text-gray-500 text-sm mb-6">เปลี่ยนชื่อผู้ใช้หรือรหัสผ่านสำหรับเข้าสู่ระบบ admin</p>
          <AccountSettingsForm currentUsername={credentials.username} />
        </div>
      </div>

      <div>
        <div className="rounded-2xl p-8" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
          <h2 className="text-gray-900 text-lg font-bold mb-1">ข้อมูลเว็บไซต์</h2>
          <p className="text-gray-500 text-sm mb-6">ชื่อเว็บไซต์และข้อมูลติดต่อที่แสดงในหน้าเว็บสาธารณะ (โลโก้และท้ายเว็บ)</p>
          <SiteSettingsForm settings={siteSettings} />
        </div>
      </div>
    </div>
  );
}
