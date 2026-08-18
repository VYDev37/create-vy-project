import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | Frontend Starter",
  description: "User dashboard and session overview connected to Go Fiber backend.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
