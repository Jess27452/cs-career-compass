import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Dashboard name="Explorer" configured={Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)} />;
}
