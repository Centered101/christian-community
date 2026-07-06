import type { ReactNode } from "react";

type Props<T> = {
  headers: string[];
  data: T[];
  getKey: (item: T) => string | number | undefined;
  renderRow: (item: T) => ReactNode;
  emptyMessage: ReactNode;
};

/** โครงตารางแบบการ์ดสีขาวที่ใช้เหมือนกันในทุกหน้ารายการของ /admin */
export default function AdminTable<T>({ headers, data, getKey, renderRow, emptyMessage }: Props<T>) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#fff", border: "1px solid #e5e7eb" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              {headers.map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-gray-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="text-center text-slate-500 py-10 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => <RowKeyWrapper key={getKey(item)}>{renderRow(item)}</RowKeyWrapper>)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** renderRow คืนค่าเป็น <tr> เปล่าๆ — wrapper นี้แค่ช่วยแนบ React key ให้ โดยไม่ต้องบังคับผู้เรียกทำเอง */
function RowKeyWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
