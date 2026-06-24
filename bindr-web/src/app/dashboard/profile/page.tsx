"use client";

import { useEffect, useState } from "react";
import { User, MapPin, Star, BookOpen, Edit } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("bindr_token");
        
        // Artificial delay of 4 seconds as requested
        await new Promise(r => setTimeout(r, 4000));

        const res = await fetch("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const historyRes = await fetch("http://localhost:5000/reading-history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const userData = await res.json();
          const historyData = historyRes.ok ? await historyRes.json() : [];
          setProfile({ ...userData, borrowed_count: historyData.length });
        } else {
          setProfile({ name: "Error Loading Profile", bio: "Could not fetch profile data." });
        }
      } catch (err) { 
        console.error(err);
        setProfile({ name: "Error Loading Profile", bio: "Could not fetch profile data." });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="p-8 max-w-[1000px] mx-auto text-center mt-20">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h2 className="text-2xl font-serif text-foreground">Loading your profile...</h2>
      <p className="text-muted mt-2">Fetching your reading statistics and details.</p>
    </div>
  );

  return (
    <div className="p-8 max-w-[1000px] mx-auto text-foreground">
      <header className="mb-10 flex justify-between items-center">
        <h1 className="font-serif text-4xl">My Profile</h1>
        <Link href="/dashboard/settings" className="px-4 py-2 bg-white border border-border rounded-lg shadow-sm flex items-center gap-2 hover:bg-gray-50 font-medium">
          <Edit size={16} /> Edit Profile
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-[var(--accent)] rounded-full flex items-center justify-center text-4xl font-bold text-[#70241C] mb-6">
              {profile.name?.substring(0, 2).toUpperCase() || "??"}
            </div>
            <h2 className="text-2xl font-bold font-serif">{profile.name}</h2>
            <p className="text-muted flex items-center justify-center gap-1 mt-2">
              <MapPin size={16} /> {profile.location || "City Unknown"}
            </p>
            
            <div className="w-full h-[1px] bg-border my-6"></div>
            
            <div className="w-full flex justify-between px-4">
              <div className="text-center">
                <p className="text-sm text-muted">Rating</p>
                <p className="text-xl font-bold flex items-center justify-center gap-1">
                  {profile.rating || "4.9"} <Star size={16} className="text-yellow-500 fill-yellow-500"/>
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted">Joined</p>
                <p className="text-xl font-bold">2026</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <User size={20} className="text-accent"/> About Me
            </h3>
            <p className="text-muted leading-relaxed">
              {profile.bio || "This user hasn't written a bio yet. They are probably busy reading!"}
            </p>
          </div>

          <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-accent"/> Favourite Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {(profile.favourite_genres || "Not Set").split(",").map((genre: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-[#F7F0E4] text-[#70241C] font-medium rounded-full text-sm inline-block">
                  {genre.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm text-center">
              <h4 className="text-sm text-muted uppercase tracking-wider font-bold mb-2">Books Shared</h4>
              <p className="font-serif text-4xl text-accent">{profile.successful_exchanges || 0}</p>
            </div>
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm text-center">
              <h4 className="text-sm text-muted uppercase tracking-wider font-bold mb-2">Books Borrowed</h4>
              <p className="font-serif text-4xl text-accent">{profile.borrowed_count || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
