import Link from "next/link";

type Action = {
  href: string;
  label: string;
  icon?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  action?: Action;
};

/** ส่วนหัวที่ใช้เหมือนกันในทุกหน้ารายการของ /admin — ชื่อหัวข้อ+จำนวนอยู่ซ้าย ปุ่มดำเนินการหลักอยู่ขวา */
export default function AdminPageHeader({ title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
      <div className="min-w-0">
        <h1 className="text-gray-900 text-lg sm:text-2xl font-bold break-words">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
          style={{ background: "linear-gradient(135deg,#157493,#0f6280)" }}
        >
          <i className={action.icon ?? "fa-solid fa-plus"}></i> {action.label}
        </Link>
      )}
    </div>
  );
}
