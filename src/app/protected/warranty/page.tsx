import { getUserId } from "@/actions/user.action";
import WarrantySection from "@/pages-sections/warranty/WarrantySection";
import { notFound } from "next/navigation";

export default async function WarrantyPage() {
  const userId = await getUserId();
  if (!userId) return notFound();

  return <WarrantySection userId={userId} />;
}
