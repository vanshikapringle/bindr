"use client";

import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-[#FCFAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-accent mb-6">
          <Database size={48} strokeWidth={1.5} />
        </div>
        <h2 className="mt-6 text-center text-4xl font-serif font-bold tracking-tight text-foreground">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          Access the Bindr. central database explorer
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-xl border border-border sm:rounded-2xl sm:px-10"
        >
          <form className="space-y-6" action="/admin/dashboard">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Admin ID
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="admin@bindr.io"
                  className="block w-full appearance-none rounded-xl border border-border px-3 py-2 placeholder-muted shadow-sm focus:border-accent focus:outline-none focus:ring-accent sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Passcode
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  defaultValue="bindr_admin"
                  className="block w-full appearance-none rounded-xl border border-border px-3 py-2 placeholder-muted shadow-sm focus:border-accent focus:outline-none focus:ring-accent sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-accent hover:text-accent-hover">
                  Forgot passcode?
                </a>
              </div>
            </div>

            <div>
              <Link href="/admin/dashboard" className="w-full">
                <button
                  type="button"
                  className="flex w-full justify-center items-center gap-2 rounded-xl border border-transparent bg-foreground py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                >
                  Enter Portal <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </form>
        </motion.div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            &larr; Back to Bindr. main site
          </Link>
        </div>
      </div>
    </div>
  );
}
