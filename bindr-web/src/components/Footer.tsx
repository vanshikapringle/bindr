import Link from "next/link";
import { Globe, Users, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full mt-20">
      {/* Cloudy/Wavy Top SVG Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-[99%]">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[90px] fill-[var(--color-midnight)]">
          <path d="M0,40 C150,80 300,0 450,30 C600,60 750,0 900,40 C1050,80 1200,30 1200,30 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="bg-[var(--color-midnight)] pt-10 pb-10 px-8 md:px-16 text-white/90">
        {/* Live Site Views Badge */}
        <div className="max-w-7xl mx-auto flex justify-end mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span><strong className="text-white">142</strong> people reading right now</span>
          </div>
        </div>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-serif text-3xl font-bold tracking-tight text-[var(--color-cherry)] mb-4">
            <img src="/logo.png" alt="Bindr Logo" className="w-16 h-16 object-contain" />
            Bindr.
          </Link>
          <p className="text-white/70 text-sm max-w-xs">
            Every book deserves another chapter. Discover, exchange, and track books with readers around you.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-white mb-4">Explore</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link href="/browse" className="hover:text-white transition-colors">Browse Books</Link></li>
            <li><Link href="/genres" className="hover:text-white transition-colors">Genres</Link></li>
            <li><Link href="/trending" className="hover:text-white transition-colors">Trending</Link></li>
            <li><Link href="/rare" className="hover:text-white transition-colors">Rare Editions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-4">Community</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link href="/members" className="hover:text-white transition-colors">Members</Link></li>
            <li><Link href="/clubs" className="hover:text-white transition-colors">Book Clubs</Link></li>
            <li><Link href="/events" className="hover:text-white transition-colors">Local Events</Link></li>
            <li><Link href="/stories" className="hover:text-white transition-colors">Exchange Stories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-4">Resources</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
            <li><Link href="/guidelines" className="hover:text-white transition-colors">Condition Guide</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-4">Support</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/20 text-sm text-white/60">
        <p>&copy; {new Date().getFullYear()} Bindr. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors"><Globe size={18} /></a>
          <a href="#" className="hover:text-white transition-colors"><Users size={18} /></a>
          <a href="#" className="hover:text-white transition-colors"><Mail size={18} /></a>
        </div>
      </div>
      </div>

    </footer>
  );
}
