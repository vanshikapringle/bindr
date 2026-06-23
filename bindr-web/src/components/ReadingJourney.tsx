"use client";

import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Create Profile", desc: "Join the community and tell us about your reading preferences." },
  { num: "02", title: "Build Shelf", desc: "Add books you own and are willing to lend or exchange." },
  { num: "03", title: "Exchange Books", desc: "Connect with locals and swap stories in person or by mail." },
  { num: "04", title: "Discover New Reads", desc: "Find rare editions and hidden gems from other shelves." },
  { num: "05", title: "Grow Your Library", desc: "Build a dynamic personal library that evolves over time." }
];

export default function ReadingJourney() {
  return (
    <section className="w-full py-24 px-8 md:px-16 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Your Reading Journey</h2>
          <p className="text-muted text-lg">Every great story begins with a single step.</p>
        </div>

        <div className="relative border-l border-border pl-10 md:pl-16 space-y-16 ml-4 md:ml-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[45px] md:-left-[69px] top-1 w-3 h-3 rounded-full bg-accent ring-4 ring-background shadow-sm"></div>
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6">
                <span className="font-serif text-2xl text-accent opacity-50">{step.num}</span>
                <div>
                  <h3 className="font-serif text-2xl text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted text-lg">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
