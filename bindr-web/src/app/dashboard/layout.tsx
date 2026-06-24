"use client";

import TopNavbar from "@/components/TopNavbar";
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
    <div className="min-h-screen flex flex-col bg-[var(--background)] font-sans">
      <TopNavbar />
      <main className="flex-1 w-full max-w-[1400px] mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
