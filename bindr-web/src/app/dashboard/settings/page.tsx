"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

export default function Settings() {
  const [form, setForm] = useState<any>({ name: "", location: "", bio: "", favourite_genres: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("bindr_token");
        const res = await fetch("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setForm(await res.json());
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("bindr_token");
      const res = await fetch("http://localhost:5000/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) alert("Profile updated successfully!");
    } catch (err) {
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-[800px] mx-auto text-foreground">
      <header className="mb-10">
        <h1 className="font-serif text-4xl mb-2">Settings</h1>
        <p className="text-muted">Manage your profile details and preferences.</p>
      </header>

      <form onSubmit={handleSave} className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Display Name</label>
          <input 
            type="text" 
            value={form.name || ""} 
            onChange={e => setForm({...form, name: e.target.value})}
            className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted mb-2">City</label>
          <input 
            type="text" 
            value={form.location || ""} 
            onChange={e => setForm({...form, location: e.target.value})}
            className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted mb-2">Favourite Genres (comma separated)</label>
          <input 
            type="text" 
            value={form.favourite_genres || ""} 
            onChange={e => setForm({...form, favourite_genres: e.target.value})}
            className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
            placeholder="e.g. Fiction, Fantasy, Sci-Fi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted mb-2">Bio</label>
          <textarea 
            rows={4}
            value={form.bio || ""} 
            onChange={e => setForm({...form, bio: e.target.value})}
            className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
            placeholder="Tell the community about your reading preferences..."
          ></textarea>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
