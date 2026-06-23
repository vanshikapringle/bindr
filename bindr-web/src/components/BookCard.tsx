import { Heart, MapPin, Handshake } from "lucide-react";

export default function BookCard({ book, distance, onWishlist, onRequest, isOwner }: any) {
  const getCoverUrl = (book: any) => {
    if (book.cover_image) return book.cover_image;
    if (book.isbn) return `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
    return `https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-L.jpg`;
  };

  return (
    <div className="bg-white border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full relative group">
      
      {/* Cover Image */}
      <div className="h-56 w-full bg-[#E8DCC8] relative overflow-hidden shrink-0 border-b border-border">
        <img src={getCoverUrl(book)} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-[#E8DCC8]" />
        
        {/* Badges Overlay on image (top corners) */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {book.availability_status === 'available' ? (
            <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Available
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
                onClick={() => onRequest?.(book)}
                disabled={book.availability_status !== 'available'}
                className="flex-1 bg-foreground text-white py-2 rounded-lg text-xs font-medium hover:bg-accent transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Handshake size={14} /> Request Exchange
              </button>
              <button 
                onClick={() => onWishlist?.(book)}
                className="p-2 border border-border rounded-lg text-muted hover:text-accent hover:border-accent transition-colors"
                title="Add to Wishlist"
              >
                <Heart size={16} />
              </button>
            </div>
          )}
          {isOwner && (
            <span className="text-xs font-medium text-muted bg-gray-100 px-2 py-1 rounded-md">
              {book.category || 'General'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
