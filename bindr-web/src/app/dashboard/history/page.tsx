"use client";
import { useEffect, useState } from "react";
export default function History() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/reading-history").then(r => r.json()).then(setItems).catch(console.error);
  }, []);
  return (
    <div className="max-w-5xl">
      <header className="mb-10"><h1 className="font-serif text-4xl mb-2">Reading History</h1></header>
      <div className="space-y-4">
        {items.length === 0 ? <p className="text-muted">No history found.</p> : items.map((item: any, i) => (
          <div key={i} className="p-4 bg-white border border-border rounded-lg shadow-sm">Book ID: {item.book_id}</div>
        ))}
      </div>
    </div>
  );
}
