"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Plus, X, Check, Image as ImageIcon } from "lucide-react";

// Reusable Select
const FloatingSelect = ({ label, value, onChange, options }: any) => (
  <div className="relative mb-6 w-full">
    <select
      value={value}
      onChange={onChange}
      className="block w-full px-4 pb-3 pt-6 text-sm text-foreground bg-transparent border border-border rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-accent peer transition-colors"
      required
    >
      <option value="" disabled hidden></option>
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <label className={`absolute text-sm text-muted duration-300 transform top-4 z-10 origin-[0] left-4 pointer-events-none ${value ? 'scale-75 -translate-y-3' : 'scale-100 translate-y-0'} peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-accent`}>
      {label}
    </label>
  </div>
);

// Reusable Input
const FloatingInput = ({ label, value, onChange, placeholder = " ", required = false }: any) => (
  <div className="relative mb-6 w-full">
    <input
      type="text"
      value={value}
      onChange={onChange}
      required={required}
      className="block w-full px-4 pb-3 pt-6 text-sm text-foreground bg-transparent border border-border rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-accent peer transition-colors"
      placeholder={placeholder}
    />
    <label className="absolute text-sm text-muted duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-accent pointer-events-none">
      {label}
    </label>
  </div>
);

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State
  const [profile, setProfile] = useState({ firstName: "", lastName: "", city: "", state: "" });
  const [preferences, setPreferences] = useState<string[]>([]);
  const [books, setBooks] = useState([{ title: "", author: "", category: "", coverImage: "" }]);

  // Mock Geocoding for now
  const getCoordinates = () => {
    // Ideally use Google Maps API or Mapbox based on city/state
    // Returning dummy coordinates for demonstration
    return { latitude: 30.7333, longitude: 76.7794 }; // Chandigarh
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("bindr_token");
      const { latitude, longitude } = getCoordinates();
      
      const payload = {
        token,
        firstName: profile.firstName,
        lastName: profile.lastName,
        city: profile.city,
        state: profile.state,
        latitude,
        longitude,
        favouriteGenres: preferences.join(", "),
        books
      };

      const res = await fetch("http://localhost:5000/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("bindr_token", data.token); // update with new flag
        window.location.href = "/dashboard";
      } else {
        alert(data || "Something went wrong.");
        setIsSubmitting(false);
      }
    } catch (err) {
      alert("Error saving onboarding data.");
      setIsSubmitting(false);
    }
  };

  const genres = [
    "Fiction", "Fantasy", "Romance", "Sci-Fi", "History", 
    "Philosophy", "Self-Help", "Business", "Mystery", "Biography"
  ];

  const fetchCoversForBooks = async () => {
    setIsSubmitting(true);
    const updatedBooks = await Promise.all(books.map(async (book) => {
      if (!book.title || !book.author || book.coverImage) return book;
      try {
        const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}`);
        const data = await res.json();
        if (data.docs && data.docs.length > 0 && data.docs[0].cover_i) {
          return { ...book, coverImage: `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg` };
        }
      } catch (err) {
        console.error("Cover fetch failed", err);
      }
      return book;
    }));
    setBooks(updatedBooks as any);
    setIsSubmitting(false);
  };

  const handleNext = async () => {
    if (step === 3) {
      await fetchCoversForBooks();
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const toggleGenre = (g: string) => {
    setPreferences(prev => 
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  };

  const addBook = () => {
    setBooks([...books, { title: "", author: "", category: "", coverImage: "" }]);
  };

  const updateBook = (index: number, field: string, value: string) => {
    const newBooks = [...books];
    newBooks[index] = { ...newBooks[index], [field]: value };
    setBooks(newBooks);
  };

  const removeBook = (index: number) => {
    if (books.length > 1) {
      const newBooks = [...books];
      newBooks.splice(index, 1);
      setBooks(newBooks);
    }
  };

  // Animation Variants
  const pageVariants: any = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8] font-sans text-foreground selection:bg-accent selection:text-white flex flex-col relative overflow-hidden">
      
      {/* Background SVG Grain */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Header */}
      <header className="p-8 relative z-10 flex justify-between items-center">
        <Link href="/" className="font-serif text-3xl font-bold">Bindr.</Link>
        {step > 1 && step < 4 && (
          <button onClick={handleBack} className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Back
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="text-center max-w-xl">
              <h1 className="font-serif text-6xl md:text-7xl mb-6 text-foreground">Welcome to Bindr.</h1>
              <p className="text-xl md:text-2xl text-muted font-light mb-12 leading-relaxed">
                Every book deserves another chapter.
              </p>
              <button onClick={handleNext} className="bg-foreground text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-accent transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1">
                Build My Shelf
              </button>
            </motion.div>
          )}

          {/* STEP 2: PROFILE */}
          {step === 2 && (
            <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-2xl">
              <h2 className="font-serif text-4xl mb-2 text-center md:text-left">Reader Profile</h2>
              <p className="text-muted mb-10 text-center md:text-left">Tell us a bit about who you are.</p>
              
              <div className="space-y-2 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput label="First Name" value={profile.firstName} onChange={(e: any) => setProfile({...profile, firstName: e.target.value})} required />
                  <FloatingInput label="Last Name" value={profile.lastName} onChange={(e: any) => setProfile({...profile, lastName: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput label="City" value={profile.city} onChange={(e: any) => setProfile({...profile, city: e.target.value})} required />
                  <FloatingInput label="State" value={profile.state} onChange={(e: any) => setProfile({...profile, state: e.target.value})} required />
                </div>
              </div>

              <h3 className="font-serif text-2xl mb-4">Favourite Genres</h3>
              <div className="flex flex-wrap gap-3 justify-start mb-8">
                {genres.map(g => {
                  const isSelected = preferences.includes(g);
                  return (
                    <button 
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
                        isSelected 
                          ? "bg-[#E8DCC8] border-accent text-accent shadow-sm" 
                          : "bg-white border-border text-muted hover:border-accent hover:text-foreground"
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={handleNext} disabled={!profile.firstName || !profile.lastName || !profile.city || !profile.state} className="flex items-center gap-2 bg-foreground text-white px-8 py-3 rounded-full font-medium hover:bg-accent transition-all shadow-md disabled:opacity-50">
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: BUILD SHELF */}
          {step === 3 && (
            <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-2xl">
              <div className="flex justify-between items-end mb-10 border-b border-border pb-4">
                <div>
                  <h2 className="font-serif text-4xl mb-2">Build Your Shelf</h2>
                  <p className="text-muted">Add the books you&apos;re willing to lend.</p>
                </div>
                <div className="text-sm font-medium text-accent bg-[#E8DCC8]/50 px-3 py-1 rounded-full">
                  {books.length} {books.length === 1 ? 'Book' : 'Books'} Added
                </div>
              </div>
              
              <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                {books.map((book, index) => (
                  <div key={index} className="bg-white p-6 border border-border rounded-2xl shadow-sm relative group flex gap-6">
                    {books.length > 1 && (
                      <button onClick={() => removeBook(index)} className="absolute top-4 right-4 text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <X size={18} />
                      </button>
                    )}
                    
                    <div className="flex-1 space-y-4">
                      <FloatingInput label="Book Title" value={book.title} onChange={(e: any) => updateBook(index, 'title', e.target.value)} />
                      <FloatingInput label="Author" value={book.author} onChange={(e: any) => updateBook(index, 'author', e.target.value)} />
                      <FloatingInput label="Category (e.g. Sci-Fi)" value={book.category} onChange={(e: any) => updateBook(index, 'category', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button onClick={addBook} className="flex items-center gap-2 text-accent font-medium hover:text-accent-hover transition-colors">
                  <Plus size={18} /> Add Another Book
                </button>
                <button onClick={handleNext} disabled={books.some(b => !b.title || !b.author)} className="flex items-center gap-2 bg-foreground text-white px-8 py-3 rounded-full font-medium hover:bg-accent transition-all shadow-md disabled:opacity-50">
                  Review Shelf <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PREVIEW */}
          {step === 4 && (
            <motion.div key="step4" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-4xl text-center">
              <h2 className="font-serif text-5xl mb-4 text-foreground">Your shelf is ready.</h2>
              <p className="text-lg text-muted mb-12">Here is a preview of your public Bindr library.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-16 px-4">
                {books.map((book, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index} 
                    className="relative aspect-[2/3] bg-[#E8DCC8] border border-[#d6c7af] rounded-r-xl rounded-l-md shadow-md overflow-hidden text-left border-l-[8px] border-l-[#70241C]"
                  >
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col justify-between p-4">
                        <div>
                          <h3 className="font-serif font-bold text-foreground line-clamp-3 leading-tight">{book.title || "Untitled Book"}</h3>
                          <p className="text-sm text-muted mt-2 line-clamp-2">{book.author || "Unknown Author"}</p>
                        </div>
                        <div className="flex justify-end">
                          <Check size={16} className="text-[#70241C]" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={handleComplete} 
                disabled={isSubmitting}
                className="bg-accent text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-accent-hover transition-all shadow-lg hover:-translate-y-1 inline-block disabled:opacity-50"
              >
                {isSubmitting ? "Building Shelf..." : "Start Exploring"}
              </button>
            </motion.div>
          )}
          
        </AnimatePresence>
      </main>

    </div>
  );
}
