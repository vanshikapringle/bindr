"use client";
import { useEffect, useState } from "react";

export default function Wishlist() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("bindr_token");
        
        // Artificial 4s delay
        await new Promise(r => setTimeout(r, 4000));
        
        const res = await fetch("http://localhost:5000/wishlist", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setItems(await res.json());
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) return (
    <div className="p-8 max-w-[1000px] mx-auto text-center mt-20">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h2 className="text-2xl font-serif text-foreground">Loading wishlist...</h2>
      <p className="text-muted mt-2">Fetching your saved books.</p>
    </div>
  );

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-foreground">
      <header className="mb-10">
        <h1 className="font-serif text-4xl mb-2">Wishlist</h1>
        <p className="text-muted text-lg">Books you have saved to read later.</p>
      </header>
      
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <h3 className="font-serif text-2xl mb-2">No wishlist items found</h3>
            <p>You haven&apos;t added any books to your wishlist yet.</p>
          </div>
        ) : (
          items.map((item: any, i) => (
            <div key={i} className="p-4 bg-white border border-border rounded-lg shadow-sm">
              <h3 className="font-serif font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-muted">{item.author}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
