"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const token = localStorage.getItem("bindr_token");
    if (!token) {
      window.location.href = "/register";
      return;
    }
    try {
      JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      localStorage.removeItem("bindr_token");
      window.location.href = "/register";
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-[#FCFAF8] font-sans">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
