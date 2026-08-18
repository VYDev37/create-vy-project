import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/Session";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard and session overview with verified authentication.",
};

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session.isLoggedIn || !session.user) {
    redirect("/login");
  }

  return <DashboardClient user={session.user} />;
}
