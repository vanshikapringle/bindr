"use client";

import { useEffect, useState } from "react";
import { Search, Tag } from "lucide-react";
import BookCard from "@/components/BookCard";

export default function Discover() {
  const [data, setData] = useState({ 
    nearby: [], 
    recent: [], 
    popular: [], 
    recommended: [] 
  });
  const [user, setUser] = useState<any>({ name: "Reader", favourite_genres: "Fiction" });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("bindr_token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      let fetchedUser = user;
      // Fetch User Profile
      const userRes = await fetch("http://localhost:5000/auth/me", { headers });
      if (userRes.ok) {
        fetchedUser = await userRes.json();
        setUser(fetchedUser);
      }
      
      // Fetch Dashboard Data (In a real app, backend would filter and sort these by location)
      const dashRes = await fetch("http://localhost:5000/public-dashboard-data", { headers });
      if (dashRes.ok) {
        const { books } = await dashRes.json();
        
        // Mocking the categorization based on requirements
        // Only books not owned by user and available are returned by backend's public-dashboard-data
        
        // 1. Available Near You (Mocked distance calculation)
        const nearby = books.slice(0, 5).map((b: any, i: number) => ({ ...b, distance: `${(i+1)*1.2} km` }));
        
        // 2. Recently Added
        const recent = books.slice(0, 8);
        
        // 3. Popular in Your Area
        const popular = books.slice().sort(() => 0.5 - Math.random()).slice(0, 5).map((b: any, i: number) => ({ ...b, distance: `${(i+2)*1.5} km` }));
        
        // 4. Recommended Reads (matching genres)
        const userGenres = fetchedUser.favourite_genres ? fetchedUser.favourite_genres.split(',') : [];
        const recommended = books.filter((b: any) => 
          userGenres.some((g: string) => b.category?.toLowerCase().includes(g.trim().toLowerCase()))
        ).slice(0, 5);
        
        // Fallback for recommended if none match
        const finalRecommended = recommended.length > 0 ? recommended : books.slice(2, 7);

        setData({
          nearby,
          recent,
          popular,
          recommended: finalRecommended
        });
      }

    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  const SvgLines = () => (
    <svg viewBox="0 0 90 120" fill="currentColor">
      <rect x="10" y="20" width="70" height="4" rx="2" />
      <rect x="10" y="35" width="70" height="4" rx="2" />
      <rect x="10" y="50" width="70" height="4" rx="2" />
      <rect x="10" y="65" width="70" height="4" rx="2" />
      <rect x="10" y="80" width="70" height="4" rx="2" />
      <rect x="10" y="95" width="40" height="4" rx="2" />
    </svg>
  );

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      // In a real app, this search would also filter out user's own books and return distance
      const res = await fetch(`http://localhost:5000/books/search?title=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const results = await res.json();
        setSearchResults(results.map((b: any) => ({ ...b, distance: 'Nearby' })));
      }
    } catch (err) { console.error(err); }
  };

  const handleRequestBook = async (book: any) => {
    try {
      const token = localStorage.getItem("bindr_token");
      const res = await fetch(`http://localhost:5000/requests/${book.book_id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Request sent successfully!");
        fetchData(); // Sync state
      } else alert(await res.text() || "Failed to send request.");
    } catch (err) { alert("Error."); }
  };

  const handleWishlist = async (book: any) => {
    try {
      const token = localStorage.getItem("bindr_token");
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
      await fetch(`http://localhost:5000/wishlist`, { method: "POST", headers, body: JSON.stringify({ book_id: book.book_id }) });
      alert("Added to wishlist!");
    } catch (err) { alert("Error updating wishlist."); }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-foreground min-h-screen">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-border pb-8">
        <div>
          <h1 className="font-serif text-4xl mb-2">Discover Books</h1>
          <p className="text-muted text-lg">Find new stories shared by readers in your neighborhood.</p>
        </div>
        <form onSubmit={handleSearch} className="relative w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, authors, or genres..." 
            className="w-full md:w-80 bg-white border border-border rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-accent shadow-sm"
          />
        </form>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-muted">Discovering local books...</div>
      ) : (
        <div className="space-y-16 pb-16">
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <section>
              <h2 className="font-serif text-3xl mb-6">Search Results</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {searchResults.map((book: any, i) => (
                  <BookCard 
                    key={i} 
                    book={book} 
                    distance={book.distance}
                    onRequest={handleRequestBook}
                    onWishlist={handleWishlist}
                  />
                ))}
              </div>
            </section>
          )}

          {!searchResults.length && (
            <>
              {/* Available Near You */}
              {data.nearby.length > 0 && (
                <section>
                  <div className="flex justify-between items-end mb-6">
                    <h2 className="font-serif text-3xl">Available Near You</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {data.nearby.map((book: any, i) => (
                      <BookCard 
                        key={i} 
                        book={book} 
                        distance={book.distance}
                        onRequest={handleRequestBook}
                        onWishlist={handleWishlist}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Recommended Reads */}
              {data.recommended.length > 0 && (
                <section>
                  <h2 className="font-serif text-3xl mb-6">Recommended Reads</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {data.recommended.map((book: any, i) => (
                      <BookCard 
                        key={i} 
                        book={book} 
                        distance={book.distance}
                        onRequest={handleRequestBook}
                        onWishlist={handleWishlist}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Popular Categories */}
              <section className="bg-[#FCFAF8] py-8 px-8 -mx-8 border-y border-border">
                <h2 className="font-serif text-2xl mb-6">Popular Genres Near You</h2>
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {['Fiction', 'Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Biography'].map(cat => (
                    <button key={cat} className="flex-shrink-0 bg-white border border-border px-8 py-4 rounded-xl font-medium text-sm hover:border-accent hover:text-accent transition-all shadow-sm hover:shadow-md flex items-center gap-2">
                      <Tag size={16} className="text-muted" /> {cat}
                    </button>
                  ))}
                </div>
              </section>

              {/* Popular In Your Area */}
              {data.popular.length > 0 && (
                <section>
                  <h2 className="font-serif text-3xl mb-6">Popular In Your Area</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {data.popular.map((book: any, i) => (
                      <BookCard 
                        key={i} 
                        book={book} 
                        distance={book.distance}
                        onRequest={handleRequestBook}
                        onWishlist={handleWishlist}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Recently Added */}
              {data.recent.length > 0 && (
                <section>
                  <h2 className="font-serif text-3xl mb-6">Recently Added</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {data.recent.map((book: any, i) => (
                      <BookCard 
                        key={i} 
                        book={book} 
                        distance={book.distance || '5.2 km'}
                        onRequest={handleRequestBook}
                        onWishlist={handleWishlist}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

        </div>
      )}
    </div>
  );
}
