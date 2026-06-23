"use client";

import { motion } from "framer-motion";

const featuredBooks = [
  {
    id: 1,
    title: "1Q84",
    author: "Haruki Murakami",
    owner: "Elena R.",
    condition: "Like New",
    available: true,
    coverColor: "bg-[#4A5D4E]"
  },
  {
    id: 2,
    title: "Kafka on the Shore",
    author: "Haruki Murakami",
    owner: "Marcus T.",
    condition: "Good",
    available: true,
    coverColor: "bg-[#A63A2F]"
  },
  {
    id: 3,
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    owner: "Sarah L.",
    condition: "Well Loved",
    available: false,
    coverColor: "bg-[#2C382E]"
  },
  {
    id: 4,
    title: "The Trial",
    author: "Franz Kafka",
    owner: "David K.",
    condition: "Excellent",
    available: true,
    coverColor: "bg-[#C58A55]"
  }
];

export default function FeaturedBooks() {
  return (
    <section className="w-full py-24 px-8 md:px-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-serif text-4xl text-foreground mb-4">Recently Added</h2>
            <p className="text-muted text-lg">Discover new arrivals in your local community.</p>
          </div>
          <button className="hidden md:block text-accent font-medium hover:text-accent-hover transition-colors">
            View All Books &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {featuredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div 
                className="w-full aspect-[2/3] bg-gray-200 rounded-r-2xl rounded-l-md shadow-md group-hover:shadow-xl transition-all duration-300 mb-6 border-l-[12px] border-black/20 p-6 flex flex-col justify-end relative overflow-hidden"
                style={{ backgroundImage: `url(https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-L.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                 <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
              </div>

              {/* Metadata */}
              <div className="px-2">
                <h4 className="font-serif text-xl text-foreground mb-1">{book.title}</h4>
                <p className="text-muted text-sm mb-3">{book.author}</p>
                
                <div className="flex items-center justify-between text-xs font-medium text-muted mb-2">
                  <span>Owner: {book.owner}</span>
                  <span>{book.condition}</span>
                </div>
                
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${book.available ? 'bg-[#E8DCC8] text-accent-hover' : 'bg-gray-200 text-gray-500'}`}>
                    {book.available ? 'Available' : 'Currently Lent'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
