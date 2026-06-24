"use client";

import Link from "next/link";
import { BookX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <BookX size={120} className="text-[var(--color-midnight)] opacity-80" strokeWidth={1} />
        </div>
        <h1 className="font-serif text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted text-lg mb-10">
          Oops! It looks like this page has been misplaced or checked out of our library.
        </p>
        <Link href="/" className="dashboard-btn !no-underline inline-flex">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
