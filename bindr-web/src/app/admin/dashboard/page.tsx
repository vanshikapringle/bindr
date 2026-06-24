"use client";

import { useState } from "react";
import { Database, Search, User, Play, Share, Plus } from "lucide-react";

export default function DatabaseExplorer() {
  const [activeTab, setActiveTab] = useState("sql");

  const tables = [
    "books", "requests", "exchanges", "users", 
    "available_books", "wishlist", "saved_books", 
    "reading_history", "reviews", "_prisma_migrations"
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--background)]">
      {/* Top Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-white shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Database size={16} className="text-muted" /> Database
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[var(--accent)]/30 px-3 py-1.5 rounded-md text-xs font-medium text-accent border border-[var(--accent)]">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Connected to prod-bindr-db
          </div>
          <div className="w-px h-6 bg-border mx-2"></div>
          <button className="flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 shadow-sm"><User size={14}/> Invite</button>
          <button className="flex items-center gap-2 bg-accent text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-accent-hover shadow-sm"><Play size={14}/> Run Query</button>
          <button className="flex items-center gap-2 bg-foreground text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-800 shadow-sm"><Plus size={14}/> New Table</button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
            <Database className="text-accent" size={28} /> Database Explorer
          </h1>
          <p className="text-muted">Direct access to the Bindr PostgreSQL telemetry and operations database.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-border p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center gap-2"><Database size={14}/> Storage Used</p>
            <p className="text-3xl font-semibold">1,024 <span className="text-lg text-muted font-normal">MB</span></p>
          </div>
          <div className="bg-white border border-border p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center gap-2"><Play size={14}/> Query Load</p>
            <p className="text-3xl font-semibold text-accent">12%</p>
          </div>
          <div className="bg-white border border-border p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center gap-2"><User size={14}/> Active Conns</p>
            <p className="text-3xl font-semibold">8</p>
          </div>
          <div className="bg-white border border-border p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center gap-2"><Database size={14}/> Total Tables</p>
            <p className="text-3xl font-semibold">{tables.length}</p>
          </div>
        </div>

        {/* Explorer Layout */}
        <div className="flex gap-6 h-[500px]">
          {/* Schema Explorer */}
          <div className="w-64 bg-white border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter tables..." 
                  className="w-full bg-[var(--background)] border border-border rounded-lg py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3">Public Schema</p>
              <div className="space-y-1">
                {tables.map(table => (
                  <button key={table} className="w-full text-left px-3 py-1.5 rounded-md text-sm text-foreground hover:bg-[var(--accent)]/50 flex items-center gap-2 transition-colors">
                    <Database size={14} className="text-muted" /> {table}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SQL Editor */}
          <div className="flex-1 bg-white border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="flex border-b border-border bg-[var(--background)]">
              <button 
                onClick={() => setActiveTab('sql')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'sql' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-foreground'}`}
              >
                SQL Editor
              </button>
              <button 
                onClick={() => setActiveTab('results')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'results' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-foreground'}`}
              >
                Results
              </button>
            </div>
            <div className="flex-1 p-6 bg-[#F8F9FA] font-mono text-sm overflow-y-auto">
              {activeTab === 'sql' ? (
                <div>
                  <span className="text-blue-600 font-bold">SELECT</span><br/>
                  &nbsp;&nbsp;<span className="text-green-600">&quot;book_id&quot;</span>,<br/>
                  &nbsp;&nbsp;<span className="text-green-600">&quot;title&quot;</span>,<br/>
                  &nbsp;&nbsp;<span className="text-green-600">&quot;author&quot;</span><br/>
                  <span className="text-blue-600 font-bold">FROM</span> <span className="text-foreground">&quot;books&quot;</span><br/>
                  <span className="text-blue-600 font-bold">LIMIT</span> <span className="text-orange-500">10</span>;
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted">
                  Run a query to see results here.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
