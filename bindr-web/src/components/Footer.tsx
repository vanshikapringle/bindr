import Link from "next/link";
import { Globe, Users, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-background pt-20 pb-10 px-8 md:px-16 border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-foreground mb-4 block">
            Bindr.
          </Link>
          <p className="text-muted text-sm max-w-xs">
            Every book deserves another chapter. Discover, exchange, and track books with readers around you.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-foreground mb-4">Explore</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link href="/browse" className="hover:text-accent transition-colors">Browse Books</Link></li>
            <li><Link href="/genres" className="hover:text-accent transition-colors">Genres</Link></li>
            <li><Link href="/trending" className="hover:text-accent transition-colors">Trending</Link></li>
            <li><Link href="/rare" className="hover:text-accent transition-colors">Rare Editions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-foreground mb-4">Community</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link href="/members" className="hover:text-accent transition-colors">Members</Link></li>
            <li><Link href="/clubs" className="hover:text-accent transition-colors">Book Clubs</Link></li>
            <li><Link href="/events" className="hover:text-accent transition-colors">Local Events</Link></li>
            <li><Link href="/stories" className="hover:text-accent transition-colors">Exchange Stories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-foreground mb-4">Resources</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link href="/how-it-works" className="hover:text-accent transition-colors">How It Works</Link></li>
            <li><Link href="/guidelines" className="hover:text-accent transition-colors">Condition Guide</Link></li>
            <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-foreground mb-4">Support</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} Bindr. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-accent transition-colors"><Globe size={18} /></a>
          <a href="#" className="hover:text-accent transition-colors"><Users size={18} /></a>
          <a href="#" className="hover:text-accent transition-colors"><Mail size={18} /></a>
        </div>
      </div>
    </footer>
  );
}
