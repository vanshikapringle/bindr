"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Home, Library, ArrowLeftRight, MessageSquare, 
  Settings, LogOut, Search, Bell, BookHeart, 
  Clock, BookMarked, HelpCircle, User
} from "lucide-react";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Shelf", href: "/dashboard/library", icon: Library },
  { name: "Exchanges", href: "/dashboard/exchanges", icon: ArrowLeftRight },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
];

const favoriteItems = [
  { name: "Wishlist", href: "/dashboard/wishlist", icon: BookHeart },
  { name: "Reading History", href: "/dashboard/history", icon: Clock },
  { name: "Saved Books", href: "/dashboard/saved", icon: BookMarked },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("bindr_token");
    if (token) {
      fetch("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <aside className="w-64 border-r border-border bg-[#FCFAF8] hidden md:flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Brand & User Profile */}
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold text-foreground">
          Bindr.
        </Link>
        <Link href="/dashboard/profile" className="w-8 h-8 bg-[#E8DCC8] rounded-full overflow-hidden border border-border flex items-center justify-center hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-accent">{user?.name ? user.name.substring(0, 2).toUpperCase() : "ME"}</span>
        </Link>
      </div>

      {/* Search */}
      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-white border border-border rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-accent transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-4 flex-1">
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  isActive 
                    ? "bg-[#E8DCC8] text-foreground font-medium shadow-sm" 
                    : "text-muted hover:bg-[#F7F0E4] hover:text-foreground"
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-accent" : ""} />
                <span>{item.name}</span>
                {item.name === "Messages" && (
                  <span className="ml-auto w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">2</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Favorites */}
        <div className="mt-8">
          <p className="px-3 text-xs font-bold text-muted uppercase tracking-wider mb-3">Favorites</p>
          <nav className="space-y-1">
            {favoriteItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm text-muted hover:bg-[#F7F0E4] hover:text-foreground"
              >
                <item.icon size={16} strokeWidth={1.5} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Bottom Settings */}
      <div className="p-4 mt-auto">
        <nav className="space-y-1">
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm text-muted hover:bg-[#F7F0E4] hover:text-foreground">
            <User size={18} strokeWidth={1.5} />
            <span>Profile</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm text-muted hover:bg-[#F7F0E4] hover:text-foreground">
            <Settings size={18} strokeWidth={1.5} />
            <span>Settings</span>
          </Link>
          <button onClick={() => { localStorage.removeItem("bindr_token"); window.location.href = "/"; }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm text-red-500 hover:bg-red-50 hover:text-red-600">
            <LogOut size={18} strokeWidth={1.5} />
            <span>Log Out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
