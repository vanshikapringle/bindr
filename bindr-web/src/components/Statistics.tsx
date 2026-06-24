"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10,000+", label: "Books Exchanged", offset: "-translate-y-4" },
  { value: "4,500+", label: "Active Readers", offset: "translate-y-8 z-10" },
  { value: "92%", label: "Successful Exchanges", offset: "-translate-y-2" },
];

export default function Statistics() {
  return (
    <section className="w-full py-24 px-8 md:px-16 bg-[var(--accent)] relative overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-center items-center gap-6 md:gap-[-20px]">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`bg-card w-full md:w-72 h-64 p-8 rounded-[2rem] border border-border shadow-xl flex flex-col items-center justify-center text-center transform ${stat.offset}`}
          >
            <h3 className="font-serif text-5xl text-accent mb-3">{stat.value}</h3>
            <p className="text-muted font-medium text-lg tracking-wide uppercase">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
