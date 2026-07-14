import AdminSidebar from "@/components/admin/sidebar";
import { AdminUploadLockProvider } from "@/lib/admin-upload-lock";
import { getAdminCredentials } from "@/lib/admin-credentials";
import { getSiteSettings } from "@/lib/data";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // ดึง username ปัจจุบัน (จาก admin_settings ถ้าเคยตั้ง, ไม่มีจึงใช้ค่าจาก .env)
  // เพื่อให้ sidebar โชว์ชื่อตรงกับที่แอดมินตั้งไว้ในหน้า /admin/settings
  const { username } = await getAdminCredentials();
  const siteSettings = await getSiteSettings();
  return (
    <AdminUploadLockProvider>
      <div className="h-screen flex flex-col md:flex-row overflow-hidden" style={{ background: "#f0f9fb" }}>
        <AdminSidebar adminName={username} siteSubtitle={siteSettings.site_subtitle} />
        <main className="flex-1 overflow-auto min-w-0">{children}</main>
      </div>
    </AdminUploadLockProvider>
  );
}
