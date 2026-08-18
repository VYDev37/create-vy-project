import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard and session overview connected to Go Fiber API.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
