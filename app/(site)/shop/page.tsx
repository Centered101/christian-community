import type { Metadata } from "next";
import ShopSection from "@/components/sections/shop-section";
import { getResources } from "@/lib/data";
import type { Resource } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "คลังค้นคว้า | ศาสนาจักรของพระเยซูคริสต์" };

export default async function ShopPage() {
  let resources: Resource[] = [];
  try {
    resources = await getResources();
  } catch {}

  return <ShopSection resources={resources} />;
}
