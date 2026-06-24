import Link from "next/link";
import { 
  Database, LayoutDashboard, Users, Flag, 
  Box, Truck, DollarSign, LogOut, Search 
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F7F0E4] text-foreground overflow-hidden font-sans">
      {/* Sidebar - Bindr Theme */}
      <aside className="w-64 bg-[var(--background)] border-r border-border flex flex-col h-full">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center">
            <Database size={18} />
          </div>
          <span className="font-serif text-xl font-bold">Bindr Admin</span>
        </div>

        <div className="px-6 mb-4 relative">
          <Search className="absolute left-9 top-1/2 -translate-y-1/2 text-muted" size={14} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-[var(--accent)]/30 border border-transparent rounded-lg py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          <div>
            <p className="px-2 text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Main</p>
            <nav className="space-y-0.5">
              <Link href="#" className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-muted hover:bg-[var(--accent)]/50 transition-colors">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link href="/admin/dashboard" className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm bg-[var(--accent)] text-foreground font-medium shadow-sm">
                <Database size={16} className="text-accent" /> Database
              </Link>
              <Link href="#" className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-muted hover:bg-[var(--accent)]/50 transition-colors">
                <Users size={16} /> Users
              </Link>
              <Link href="#" className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-muted hover:bg-[var(--accent)]/50 transition-colors">
                <Flag size={16} /> Reports
              </Link>
            </nav>
          </div>

          <div>
            <p className="px-2 text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Workgroups</p>
            <nav className="space-y-0.5">
              <div className="px-2 py-1.5 text-sm font-medium text-foreground flex items-center gap-2">
                <span className="text-accent">▾</span> All Work
              </div>
              <div className="pl-6 space-y-1">
                <Link href="#" className="block py-1 text-sm text-muted hover:text-foreground flex items-center gap-2"><Box size={14}/> Operations</Link>
                <Link href="#" className="block py-1 text-sm text-muted hover:text-foreground flex items-center gap-2"><Truck size={14}/> Logistics</Link>
                <Link href="#" className="block py-1 text-sm text-muted hover:text-foreground flex items-center gap-2"><DollarSign size={14}/> Expenses</Link>
              </div>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-muted hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={16} /> Log Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
