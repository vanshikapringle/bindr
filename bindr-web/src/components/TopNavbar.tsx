"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Home, Library, ArrowLeftRight, MessageSquare, 
  Settings, LogOut, Search, User, Menu, X, Heart
} from "lucide-react";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Shelf", href: "/dashboard/library", icon: Library },
  { name: "Exchanges", href: "/dashboard/exchanges", icon: ArrowLeftRight },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
];

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/dashboard`);
    }
  };

  return (
    <header className="bg-[var(--color-midnight)] border-b border-white/10 sticky top-0 z-40 w-full shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          
          {/* Brand & Sidebar Toggle */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button onClick={() => setIsSidebarOpen(true)} className="text-[var(--color-cherry)] hover:text-white transition-colors">
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-bold text-[var(--color-cherry)]">
              <img src="/logo.png" alt="Bindr Logo" className="w-12 h-12 object-contain" />
              Bindr.
            </Link>
          </div>
            
          {/* Desktop Nav - Centered */}
          <nav className="hidden md:flex space-x-1 absolute left-1/2 -translate-x-1/2">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium ${
                    isActive 
                      ? "bg-[var(--color-cherry)] text-[var(--color-midnight)] shadow-sm" 
                      : "text-[var(--color-cherry-light)] opacity-80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon size={16} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-[var(--color-midnight)]" : ""} />
                  <span>{item.name}</span>
                  {item.name === "Messages" && (
                    <span className="ml-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">2</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <form onSubmit={handleSearch} className="relative w-64 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-midnight)]/60" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titles, authors, or genres..." 
                className="w-full bg-[var(--color-cherry)] text-[var(--color-midnight)] border border-[var(--color-midnight)]/20 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-midnight)]/50 transition-colors shadow-sm placeholder:text-[var(--color-midnight)]/60"
              />
            </form>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-9 h-9 bg-[var(--color-cherry)] rounded-full overflow-hidden border border-white/20 flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
              >
                <span className="text-xs font-bold text-[var(--color-midnight)]">{user?.name ? user.name.substring(0, 2).toUpperCase() : user?.first_name ? user.first_name.substring(0, 2).toUpperCase() : "ME"}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-border py-1 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-muted truncate">{user?.email}</p>
                  </div>
                  <Link href="/dashboard/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:bg-accent/10 hover:text-foreground">
                    <User size={16} /> Profile
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:bg-accent/10 hover:text-foreground">
                    <Settings size={16} /> Settings
                  </Link>
                  <button 
                    onClick={() => { localStorage.removeItem("bindr_token"); window.location.href = "/"; }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 text-left"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[var(--color-cherry)] hover:text-white transition-colors">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[var(--color-midnight)]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <form onSubmit={handleSearch} className="relative w-full px-2 mb-4 mt-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..." 
                className="w-full bg-white border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent shadow-sm"
              />
            </form>
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? "bg-[var(--color-cherry)] text-[var(--color-midnight)]" : "text-[var(--color-cherry)] hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <item.icon size={18} />
                    {item.name}
                  </div>
                </Link>
              );
            })}
            <div className="border-t border-white/10 mt-4 pt-4 pb-2">
              <Link href="/dashboard/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[var(--color-cherry)] hover:bg-white/10 hover:text-white">
                Profile
              </Link>
              <Link href="/dashboard/settings" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[var(--color-cherry)] hover:bg-white/10 hover:text-white">
                Settings
              </Link>
              <button 
                onClick={() => { localStorage.removeItem("bindr_token"); window.location.href = "/"; }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Drawer */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl flex flex-col transform transition-transform duration-300 translate-x-0">
            <div className="p-6 border-b border-border flex justify-between items-center bg-[var(--color-midnight)]">
              <span className="font-serif text-2xl font-bold text-[var(--color-cherry)]">Menu</span>
              <button onClick={() => setIsSidebarOpen(false)} className="text-[var(--color-cherry)] hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 bg-[var(--background)]">
              <Link href="/dashboard/library?tab=wishlist" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-[var(--color-midnight)] hover:text-[var(--color-cherry)] rounded-xl transition-colors font-medium">
                <Search size={20} /> Wishlist
              </Link>
              <Link href="/dashboard/library?tab=shelf" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-[var(--color-midnight)] hover:text-[var(--color-cherry)] rounded-xl transition-colors font-medium">
                <Heart size={20} /> Favourites
              </Link>
              <Link href="/dashboard/profile" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-[var(--color-midnight)] hover:text-[var(--color-cherry)] rounded-xl transition-colors font-medium">
                <User size={20} /> Profile
              </Link>
              <Link href="/dashboard/settings" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-[var(--color-midnight)] hover:text-[var(--color-cherry)] rounded-xl transition-colors font-medium">
                <Settings size={20} /> Settings
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
