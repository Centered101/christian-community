import { getSiteSettings } from "@/lib/data";
import AdminLoginForm from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  // ดึงชื่อศาสนจักร/วอร์ดจาก site_settings เพื่อให้แผงซ้ายเปลี่ยนตามที่ตั้งใน /admin/settings
  const settings = await getSiteSettings();
  return <AdminLoginForm siteName={settings.site_name} siteSubtitle={settings.site_subtitle} />;
}
