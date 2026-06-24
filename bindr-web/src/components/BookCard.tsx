import { Heart, MapPin, Handshake, X, Edit, Info } from "lucide-react";
import { useState } from "react";

interface BookCardProps {
  book: any;
  distance?: string;
  onWishlist?: (book: any) => void;
  onRequest?: (book: any) => void;
  isOwner?: boolean;
  onMarkCompleted?: (bookId: number) => void;
}

export default function BookCard({ book, distance, onWishlist, onRequest, isOwner, onMarkCompleted }: BookCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [openLibData, setOpenLibData] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: book.title, author: book.author, category: book.category });

  const getCoverUrl = (book: any) => {
    if (book.cover_image) return book.cover_image;
    if (book.isbn) return `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
    return `https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-L.jpg`;
  };

  const handleCardClick = async () => {
    setShowModal(true);
    setLoadingDetails(true);
    try {
      const fetchRes = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}`);
      const data = await fetchRes.json();
      if (data.docs && data.docs.length > 0) {
        setOpenLibData(data.docs[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("bindr_token");
      const res = await fetch(`http://localhost:5000/books/${book.book_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to update book.");
      }
    } catch (err) {
      alert("Error updating book.");
    }
  };

  const handleDeleteBook = async () => {
    if (!confirm("Are you sure you want to delete this book? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("bindr_token");
      const res = await fetch(`http://localhost:5000/books/${book.book_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete book.");
      }
    } catch (err) {
      alert("Error deleting book.");
    }
  };

  return (
    <>
    <div 
      onClick={handleCardClick}
      className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full relative group cursor-pointer"
    >
      
      {/* Cover Image */}
      <div className="h-56 w-full bg-accent/10 relative overflow-hidden shrink-0 border-b border-border">
        <img src={getCoverUrl(book)} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-accent/10" />
        
        {/* Badges Overlay on image (top corners) */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {book.availability_status === 'available' ? (
            <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Available
            </span>
          ) : book.availability_status === 'completed' ? (
            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Completed
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {book.availability_status?.replace('_', ' ')}
            </span>
          )}
        </div>

        {distance && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <MapPin size={12} className="text-accent" /> {distance}
          </div>
        )}
      </div>

      {/* Content Below Cover */}
      <div className="p-4 flex flex-col flex-grow bg-white">
        <h4 className="font-serif font-bold text-lg text-foreground line-clamp-1 mb-1">{book.title}</h4>
        <p className="text-sm text-muted line-clamp-1 mb-3">{book.author}</p>
        
        <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
          {!isOwner && (
            <div className="flex gap-2 w-full">
              <button 
                onClick={(e) => { e.stopPropagation(); onRequest?.(book); }}
                disabled={book.availability_status !== 'available'}
                className="flex-1 bg-foreground text-white py-2 rounded-lg text-xs font-medium hover:bg-accent transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Handshake size={14} /> Request Exchange
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onWishlist?.(book); }}
                className="p-2 border border-border rounded-lg text-muted hover:text-accent hover:border-accent transition-colors"
                title="Add to Wishlist"
              >
                <Heart size={16} />
              </button>
            </div>
          )}
          {isOwner && (
            <div className="flex justify-between items-center w-full">
              <span className="text-xs font-medium text-muted bg-gray-100 px-2 py-1 rounded-md">
                {book.category || 'General'}
              </span>
              {onMarkCompleted && book.availability_status === 'reading' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onMarkCompleted(book.book_id); }}
                  className="text-xs bg-accent text-white px-3 py-1 rounded-md hover:bg-accent-hover transition-colors"
                >
                  Complete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

    {showModal && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-muted hover:text-foreground">
            <X size={20} />
          </button>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 shrink-0">
              <img src={getCoverUrl(book)} alt={book.title} className="w-full rounded-xl shadow-md border border-border" />
            </div>
            <div className="flex-1">
              {!isEditing ? (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-serif text-3xl font-bold">{book.title}</h2>
                    {isOwner && (
                      <button onClick={() => setIsEditing(true)} className="text-muted hover:text-accent flex items-center gap-1 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-border">
                        <Edit size={14} /> Edit
                      </button>
                    )}
                  </div>
                  <p className="text-xl text-muted mb-4">{book.author}</p>
                  
                  <div className="flex gap-2 mb-6">
                    <span className="bg-background border border-border text-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {book.category || 'Fiction'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm ${book.availability_status === 'available' ? 'bg-green-100 text-green-800' : book.availability_status === 'completed' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                      {book.availability_status?.replace('_', ' ') || 'Available'}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2 border-b border-border pb-2"><Info size={18}/> About this book</h3>
                  {loadingDetails ? (
                    <p className="text-muted text-sm italic">Fetching expanded details from Open Library...</p>
                  ) : openLibData ? (
                    <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                      <p><strong className="text-foreground">Exact Title:</strong> {openLibData.title}</p>
                      <p><strong className="text-foreground">Author(s):</strong> {openLibData.author_name?.join(", ") || book.author}</p>
                      <p><strong className="text-foreground">First Published:</strong> {openLibData.first_publish_year || 'Unknown'}</p>
                      {openLibData.subject && (
                        <div>
                          <strong className="text-foreground block mb-1">Subjects & Genres:</strong>
                          <div className="flex flex-wrap gap-1">
                            {openLibData.subject.slice(0, 5).map((sub: string, i: number) => (
                              <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{sub}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted text-sm italic">No extended details found for this specific edition.</p>
                  )}
                  
                  {!isOwner && (
                    <button 
                      onClick={() => { setShowModal(false); onRequest?.(book); }}
                      disabled={book.availability_status !== 'available'}
                      className="mt-8 w-full dashboard-btn disabled:opacity-50"
                    >
                      <Handshake size={18} /> Request Exchange
                    </button>
                  )}
                  {isOwner && onMarkCompleted && book.availability_status === 'reading' && (
                    <button 
                      onClick={() => onMarkCompleted(book.book_id)}
                      className="mt-4 w-full dashboard-btn shadow-sm"
                    >
                      Mark as Completed
                    </button>
                  )}
                </>
              ) : (
                <form onSubmit={handleEditSubmit} className="space-y-4 bg-background p-6 rounded-xl border border-border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-xl font-bold">Edit Book Details</h3>
                    <button type="button" onClick={handleDeleteBook} className="text-red-500 hover:text-red-700 text-sm font-medium border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <X size={14} /> Delete Book
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Title</label>
                    <input 
                      type="text" required value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})}
                      className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Author</label>
                    <input 
                      type="text" required value={editForm.author} onChange={e => setEditForm({...editForm, author: e.target.value})}
                      className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Category</label>
                    <input 
                      type="text" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}
                      className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent bg-white"
                    />
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button type="submit" className="flex-1 bg-accent text-white py-2 rounded-lg font-medium hover:bg-accent-hover transition-colors">Save Changes</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-white border border-border text-foreground py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
