import { MapPin, BookOpen } from "lucide-react";

export default function ReaderCard({ reader, distance }: any) {
  return (
    <div className="bg-white border border-border rounded-2xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-all hover:-translate-y-1">
      <div className="w-20 h-20 bg-[var(--accent)] rounded-full mb-4 flex items-center justify-center text-accent font-serif text-3xl font-bold shadow-inner border border-white">
        {reader.first_name ? reader.first_name[0] : reader.name?.[0] || "?"}
      </div>
      
      <h4 className="font-serif font-bold text-xl text-foreground mb-1">
        {reader.first_name || reader.name}
      </h4>
      
      <div className="flex items-center gap-1 text-sm text-muted mb-4">
        <MapPin size={14} className="text-accent" />
        <span>{reader.city || 'Nearby'} {distance && `• ${distance}`}</span>
      </div>
      
      <div className="flex items-center gap-2 bg-[var(--background)] px-4 py-2 rounded-full text-sm font-medium border border-border w-full justify-center">
        <BookOpen size={16} className="text-muted" />
        <span>{reader.books_shared || 0} Books Shared</span>
      </div>
    </div>
  );
}
