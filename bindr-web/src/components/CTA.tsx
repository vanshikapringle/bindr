import Link from "next/link";

export default function CTA() {
  return (
    <section className="w-full py-24 px-8 md:px-16 bg-background">
      <div className="max-w-5xl mx-auto bg-[#E8DCC8] rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden border border-border/50 shadow-sm">
        {/* Subtle Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] mix-blend-multiply pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-8 max-w-2xl leading-tight">
            Your Next Favorite Book Is Waiting.
          </h2>
          <Link
            href="/exchange"
            className="bg-accent text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-accent-hover transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Start Exchanging
          </Link>
        </div>
      </div>
    </section>
  );
}
