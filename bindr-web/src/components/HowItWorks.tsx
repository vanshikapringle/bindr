"use client";

import { motion } from "framer-motion";
import { BookPlus, Search, RefreshCw } from "lucide-react";

const steps = [
  {
    title: "List a Book",
    description: "Upload a book you want to exchange. Give it a new chapter in someone else's hands.",
    icon: BookPlus,
  },
  {
    title: "Find a Match",
    description: "Discover readers interested in your books, or find the exact title you've been searching for.",
    icon: Search,
  },
  {
    title: "Exchange & Track",
    description: "Swap books locally or by mail, and track every exchange seamlessly on your profile.",
    icon: RefreshCw,
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-24 px-8 md:px-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">How It Works</h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            A simple, human way to share stories and discover your next favorite read.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-card p-10 rounded-[2rem] border border-border flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-accent mb-6">
                <step.icon strokeWidth={1.5} size={32} />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-4">{step.title}</h3>
              <p className="text-muted leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
