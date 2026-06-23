"use client";

import { useEffect, useState } from "react";
import { BookOpen, Search, Filter, Plus, Heart, Bookmark, History, MoreVertical, X, Handshake, Users, Star, ArrowLeftRight } from "lucide-react";
import BookCard from "@/components/BookCard";
import ReaderCard from "@/components/ReaderCard";
import ReturnTracker from "@/components/ReturnTracker";
import LendingStatusFlow from "@/components/LendingStatusFlow";

export default function MyLibrary() {
  const [activeTab, setActiveTab] = useState("shelf");
  const [data, setData] = useState<any>({ 
    shelf: [], 
    reading: [], 
    lent: [], 
    wishlist: [], 
    history: [], 
    nearby: [],
    stats: { shared: 0, borrowed: 0, exchanges: 0, rating: 0 }
  });
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ title: "", author: "", category: "Fiction", coverImage: "" });

  useEffect(() => {
    // In a real implementation, we would fetch all these from the backend.
    // For now, we simulate the structure.
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("bindr_token");
        const headers = { Authorization: `Bearer ${token}` };

        const [shelfRes, wishlistRes, incomingRes, outgoingRes] = await Promise.all([
          fetch("http://localhost:5000/books/my-books", { headers }),
          fetch("http://localhost:5000/wishlist", { headers }),
          fetch("http://localhost:5000/requests/incoming", { headers }),
          fetch("http://localhost:5000/requests/outgoing", { headers })
        ]);

        const shelf = shelfRes.ok ? await shelfRes.json() : [];
        const wishlist = wishlistRes.ok ? await wishlistRes.json() : [];
        const incoming = incomingRes.ok ? await incomingRes.json() : [];
        const outgoing = outgoingRes.ok ? await outgoingRes.json() : [];

        // Active statuses for reading/lent tabs
        const activeStatuses = ["accepted", "picked_up", "currently_reading", "returned"];
        const lent = incoming.filter((r: any) => activeStatuses.includes(r.status));
        const reading = outgoing.filter((r: any) => activeStatuses.includes(r.status));

        setData({
          shelf,
          reading,
          lent,
          wishlist,
          history: [], // Will be handled via profile API or separate endpoint
          nearby: [
            { id: 1, first_name: "Ananya", city: "Mohali", books_shared: 12 },
            { id: 2, first_name: "Rahul", city: "Chandigarh", books_shared: 34 }
          ],
          stats: { shared: shelf.length, borrowed: 12, exchanges: 8, rating: 4.8 }
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddBook = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("bindr_token");
      
      let cover_image = "";
      try {
        const fetchRes = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(addForm.title)}&author=${encodeURIComponent(addForm.author)}`);
        const data = await fetchRes.json();
        if (data.docs && data.docs.length > 0 && data.docs[0].cover_i) {
          cover_image = `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`;
        }
      } catch (err) {
        console.error("Cover fetch failed", err);
      }

      const res = await fetch("http://localhost:5000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...addForm, cover_image })
      });
      if (res.ok) {
        const newBook = await res.json();
        setData((prev: any) => ({ ...prev, shelf: [newBook, ...prev.shelf], stats: { ...prev.stats, shared: prev.stats.shared + 1 } }));
        setShowAddModal(false);
        setAddForm({ title: "", author: "", category: "Fiction", coverImage: "" });
      } else {
        alert("Failed to add book.");
      }
    } catch (err) {
      alert("Error.");
    }
  };

  const handleReturnBook = async (requestId: number) => {
    try {
      const token = localStorage.getItem("bindr_token");
      const res = await fetch(`http://localhost:5000/requests/status/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "exchange_completed" })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to mark as returned.");
      }
    } catch (err) {
      alert("Error.");
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-foreground min-h-screen">
      
      {/* Header with Stats */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-serif text-4xl mb-3">My Library</h1>
          <p className="text-muted text-lg">Your reading journey and community contributions.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white border border-border px-4 py-2 rounded-xl text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold">Books Shared</p>
            <p className="font-serif text-2xl font-bold">{data.stats.shared}</p>
          </div>
          <div className="bg-white border border-border px-4 py-2 rounded-xl text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold">Borrowed</p>
            <p className="font-serif text-2xl font-bold">{data.stats.borrowed}</p>
          </div>
          <div className="bg-white border border-border px-4 py-2 rounded-xl text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold">Exchanges</p>
            <p className="font-serif text-2xl font-bold">{data.stats.exchanges}</p>
          </div>
          <div className="bg-white border border-border px-4 py-2 rounded-xl text-center shadow-sm flex flex-col items-center justify-center bg-[#FCFAF8]">
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold flex items-center gap-1"><Star size={10} className="fill-accent text-accent" /> Rating</p>
            <p className="font-serif text-2xl font-bold text-accent">{data.stats.rating}</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-border mb-10 overflow-x-auto custom-scrollbar">
        {[
          { id: "shelf", label: "My Shelf", icon: BookOpen },
          { id: "reading", label: "Books I'm Reading", icon: BookOpen },
          { id: "lent", label: "Books I've Lent", icon: Handshake },
          { id: "history", label: "Reading History", icon: History }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 px-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? "border-accent text-accent" 
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-muted">Loading your library...</div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl">
                {activeTab === "shelf" && "Books I'm willing to lend"}
                {activeTab === "reading" && "Add your current read"}
                {activeTab === "lent" && "Books circulating in the community"}
                {activeTab === "wishlist" && "Books I want to borrow"}
                {activeTab === "history" && "Books I've completed"}
                {activeTab === "nearby" && "Readers in your neighborhood"}
              </h2>
              {activeTab === "shelf" && (
                <button onClick={() => setShowAddModal(true)} className="bg-foreground text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2 shadow-sm">
                  <Plus size={16} /> Add to Shelf
                </button>
              )}
              {activeTab === "reading" && (
                <button onClick={() => setShowAddModal(true)} className="bg-foreground text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2 shadow-sm">
                  <Plus size={16} /> Add Current Read
                </button>
              )}
            </div>

            {activeTab === "nearby" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.nearby.map((reader: any, i: number) => (
                  <ReaderCard key={i} reader={reader} distance={`${(i+1)*2.3} km`} />
                ))}
              </div>
            ) : activeTab === "reading" || activeTab === "lent" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(activeTab === "reading" ? data.reading : data.lent).map((book: any, i: number) => (
                  <div key={i} className="bg-white border border-border rounded-2xl shadow-sm p-6 flex gap-6">
                    <div className="w-32 shrink-0">
                       <img src={book.cover_image} alt={book.title} className="w-full aspect-[2/3] object-cover rounded-md shadow-sm border border-border" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h4 className="font-serif font-bold text-xl mb-1">{book.title}</h4>
                      <p className="text-muted text-sm mb-4">{book.author}</p>
                      
                      <div className="bg-[#FCFAF8] p-4 rounded-xl border border-border mb-4">
                        <LendingStatusFlow currentStatus={book.status} />
                      </div>
                      
                      <ReturnTracker borrowDate={book.borrow_date} returnDate={book.return_date} />
                      <button 
                        onClick={() => handleReturnBook(book.request_id)}
                        className="mt-4 w-full bg-foreground text-white py-2 rounded-lg font-medium hover:bg-accent transition-colors"
                      >
                        Complete Exchange (Mark as Returned)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {(data as any)[activeTab].map((book: any, i: number) => (
                  <BookCard key={i} book={book} isOwner={activeTab === "shelf"} />
                ))}
                
                {activeTab === "shelf" && (
                  <button onClick={() => setShowAddModal(true)} className="aspect-[2/3] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-[#FCFAF8] transition-all">
                    <Plus size={32} className="mb-2" />
                    <span className="font-medium text-sm">Add New Book</span>
                  </button>
                )}
              </div>
            )}

            {(data as any)[activeTab].length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center bg-white border border-border rounded-2xl p-8">
                <BookOpen size={48} className="text-border mb-4" />
                {activeTab === "shelf" && (
                  <>
                    <h3 className="font-serif text-2xl text-muted mb-2">Your shelf is empty</h3>
                    <p className="text-sm text-muted max-w-md mb-6">
                      Add your first book and let it find a new reader.
                    </p>
                    <button onClick={() => setShowAddModal(true)} className="bg-foreground text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent transition-colors">
                      Add New Book
                    </button>
                  </>
                )}
                {activeTab === "wishlist" && (
                  <>
                    <h3 className="font-serif text-2xl text-muted mb-2">Nothing here yet</h3>
                    <p className="text-sm text-muted max-w-md">
                      Books you save for later will appear here.
                    </p>
                  </>
                )}
                {activeTab === "reading" && (
                  <>
                    <h3 className="font-serif text-2xl text-muted mb-2">Nothing here yet</h3>
                    <p className="text-sm text-muted max-w-md mb-6">
                      Add your current read.
                    </p>
                    <button onClick={() => setShowAddModal(true)} className="bg-foreground text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent transition-colors">
                      Add Current Read
                    </button>
                  </>
                )}
                {activeTab !== "shelf" && activeTab !== "wishlist" && activeTab !== "reading" && (
                  <>
                    <h3 className="font-serif text-2xl text-muted mb-2">Nothing here yet</h3>
                    <p className="text-sm text-muted max-w-md">
                      Keep exploring the community to build your library.
                    </p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-muted hover:text-foreground">
              <X size={20} />
            </button>
            <h2 className="font-serif text-2xl mb-2">Add to My Shelf</h2>
            <p className="text-muted mb-6 text-sm">Add a book you are willing to lend.</p>
            
            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={addForm.title}
                  onChange={e => setAddForm({...addForm, title: e.target.value})}
                  className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Author</label>
                <input 
                  type="text" 
                  required
                  value={addForm.author}
                  onChange={e => setAddForm({...addForm, author: e.target.value})}
                  className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Category</label>
                <input 
                  type="text" 
                  value={addForm.category}
                  onChange={e => setAddForm({...addForm, category: e.target.value})}
                  className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <button type="submit" className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent-hover mt-4 transition-colors">
                Add Book
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
