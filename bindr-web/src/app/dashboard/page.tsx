"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Tag } from "lucide-react";
import BookCard from "@/components/BookCard";

function DiscoverContent() {
  const [data, setData] = useState({ 
    nearby: [], 
    recent: [], 
    popular: [], 
    recommended: [],
    communityReads: []
  });
  const [user, setUser] = useState<any>({ name: "Reader", favourite_genres: "Fiction" });
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchParamQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
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
        const { books, community_reads } = await dashRes.json();
        
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
          recommended: finalRecommended,
          communityReads: community_reads || []
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

  useEffect(() => {
    if (searchParamQuery) {
      setSearchQuery(searchParamQuery);
      performSearch(searchParamQuery);
    } else {
      setSearchResults([]);
      setSearchQuery("");
    }
  }, [searchParamQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/books/search?title=${encodeURIComponent(query)}`);
      if (res.ok) {
        const results = await res.json();
        setSearchResults(results.map((b: any) => ({ ...b, distance: 'Nearby' })));
      }
    } catch (err) { console.error(err); }
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    performSearch(searchQuery);
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
      <header className="mb-12 border-b border-border pb-8">
        <div>
          <h1 className="font-serif text-4xl mb-2">Discover Books</h1>
          <p className="text-muted text-lg">Find new stories shared by readers in your neighborhood.</p>
        </div>
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
              {/* Community is Reading */}
              {data.communityReads?.length > 0 && (
                <section>
                  <div className="flex justify-between items-end mb-6">
                    <h2 className="font-serif text-3xl">Community is Reading</h2>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                    {data.communityReads.map((book: any, i) => (
                      <div key={i} className="flex-shrink-0 w-48 bg-card border border-border rounded-xl p-3 shadow-sm relative cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => handleRequestBook(book)}>
                        <img 
                          src={book.cover_image || "/placeholder.jpg"} 
                          alt={book.title} 
                          className="w-full aspect-[2/3] object-cover rounded-md mb-3"
                        />
                        <p className="text-sm font-bold text-foreground line-clamp-1">{book.title}</p>
                        <p className="text-xs text-muted mb-2 line-clamp-1">{book.author}</p>
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                          <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center text-[10px] font-bold text-accent">
                            {book.reader_name?.substring(0, 2).toUpperCase() || "U"}
                          </div>
                          <span className="text-xs text-muted">
                            {book.availability_status === 'completed' ? 'Finished reading' : 'Currently reading'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

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

              {/* For You Recommendations */}
              {data.recommended.length > 0 && (
                <section>
                  <h2 className="font-serif text-3xl mb-6 border-b border-border pb-4">For You</h2>
                  <p className="text-muted text-sm mb-6">Based on your favorite genres ({user.favourite_genres})</p>
                  <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                    {data.recommended.map((book: any, i) => (
                      <div key={i} className="flex-shrink-0 w-40 cursor-pointer hover:scale-105 transition-transform" onClick={() => handleRequestBook(book)}>
                        <img 
                          src={book.cover_image || "/placeholder.jpg"} 
                          alt={book.title} 
                          className="w-full aspect-[2/3] object-cover rounded-md shadow-md"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Popular Categories */}
              <section className="bg-background py-8 px-8 -mx-8 border-y border-border">
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

export default function Discover() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Loading dashboard...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
