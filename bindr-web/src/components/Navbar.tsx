"use client";

import Link from "next/link";
import { Menu, Search, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("bindr_token");
    if (token) {
      setIsLoggedIn(true);
      fetch("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error(err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bindr_token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };
  return (
    <nav className="w-full bg-[var(--color-midnight)]/95 backdrop-blur-lg py-4 px-8 md:px-16 flex items-center justify-between z-50 shadow-xl border-b border-[var(--color-cherry)]/20 sticky top-0 transition-all duration-300">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-2 font-serif text-3xl font-bold tracking-tight text-[var(--color-cherry)]">
          <img src="/logo.png" alt="Bindr Logo" className="w-16 h-16 object-contain" />
          Bindr.
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-cherry)] opacity-90">
          <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
          <Link href="#featured" className="hover:text-white transition-colors">Featured Books</Link>
          <Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <>
            <div className="relative group hidden md:block">
              <button className="flex items-center gap-2 text-sm font-medium text-[var(--color-cherry)] hover:text-white transition-colors">
                <div className="w-9 h-9 bg-[var(--color-cherry)] rounded-full flex items-center justify-center border border-white/20 overflow-hidden shadow-sm">
                  <span className="text-xs font-bold text-[var(--color-midnight)]">{user?.name ? user.name.substring(0, 2).toUpperCase() : "ME"}</span>
                </div>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2 z-50">
                {user && (
                  <div className="px-4 py-3 border-b border-border mb-2">
                    <p className="text-sm font-bold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                )}
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-foreground hover:bg-[var(--background)] hover:text-[var(--color-midnight)] rounded-lg transition-colors">Dashboard</Link>
                <Link href="/dashboard/profile" className="px-4 py-2 text-sm font-medium text-foreground hover:bg-[var(--background)] hover:text-[var(--color-midnight)] rounded-lg transition-colors">Profile</Link>
                <Link href="/dashboard/settings" className="px-4 py-2 text-sm font-medium text-foreground hover:bg-[var(--background)] hover:text-[var(--color-midnight)] rounded-lg transition-colors">Settings</Link>
                <div className="h-px bg-border my-1"></div>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 text-left rounded-lg transition-colors">Log Out</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link href="/register?mode=login" className="hidden md:block text-[var(--color-cherry)] hover:text-white font-medium transition-colors">Log In</Link>
            <Link href="/register?mode=register" className="hidden md:block bg-[var(--color-green)] text-[var(--color-cherry)] px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity shadow-sm">
              Join Bindr
            </Link>
          </>
        )}
        <button className="md:hidden text-foreground">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}
