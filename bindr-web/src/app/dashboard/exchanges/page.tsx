"use client";

import { useEffect, useState } from "react";
import { Check, X, MessageCircle } from "lucide-react";

export default function Exchanges() {
  const [activeTab, setActiveTab] = useState("incoming");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("bindr_token");
      const headers = { Authorization: `Bearer ${token}` };

      // Artificial 4 second delay
      await new Promise(r => setTimeout(r, 4000));

      let finalRequests = [];
      if (activeTab === "incoming") {
        const res = await fetch("http://localhost:5000/requests/incoming", { headers });
        if (res.ok) finalRequests = await res.json();
      } else if (activeTab === "outgoing") {
        const res = await fetch("http://localhost:5000/requests/outgoing", { headers });
        if (res.ok) finalRequests = await res.json();
      } else if (activeTab === "active") {
        const [inRes, outRes] = await Promise.all([
          fetch("http://localhost:5000/requests/incoming", { headers }),
          fetch("http://localhost:5000/requests/outgoing", { headers })
        ]);
        const inReq = inRes.ok ? await inRes.json() : [];
        const outReq = outRes.ok ? await outRes.json() : [];
        const combined = [...inReq, ...outReq];
        const activeStatuses = ["accepted", "picked_up", "currently_reading"];
        finalRequests = combined.filter((r: any) => activeStatuses.includes(r.status));
      } else {
        const res = await fetch("http://localhost:5000/requests/incoming", { headers });
        if (res.ok) {
          const data = await res.json();
          finalRequests = data.filter((r: any) => r.status === "exchange_completed" || r.status === "returned" || r.status === "rejected");
        }
      }
      setRequests(finalRequests);
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const handleAcceptRequest = async (requestId: number) => {
    try {
      const token = localStorage.getItem("bindr_token");
      const res = await fetch(`http://localhost:5000/requests/accept/${requestId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchRequests(); // Sync state
    } catch (err) { alert("Error accepting request."); }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      const token = localStorage.getItem("bindr_token");
      const res = await fetch(`http://localhost:5000/requests/reject/${requestId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchRequests(); // Sync state
    } catch (err) { alert("Error rejecting request."); }
  };

  const handleReturnBook = async (requestId: number) => {
    try {
      const token = localStorage.getItem("bindr_token");
      const res = await fetch(`http://localhost:5000/requests/status/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "exchange_completed" })
      });
      if (res.ok) fetchRequests(); // Sync state
      else alert("Failed to mark as returned.");
    } catch (err) { alert("Error returning request."); }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-foreground min-h-screen">
      <header className="mb-10">
        <h1 className="font-serif text-4xl text-foreground mb-2">Exchanges</h1>
        <p className="text-muted text-lg">Track your outgoing requests and incoming offers.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-border mb-8">
        <button 
          onClick={() => setActiveTab("incoming")}
          className={`pb-4 font-medium transition-colors border-b-2 ${activeTab === "incoming" ? "text-accent border-accent" : "border-transparent text-muted hover:text-foreground"}`}
        >
          Incoming Requests
        </button>
        <button 
          onClick={() => setActiveTab("outgoing")}
          className={`pb-4 font-medium transition-colors border-b-2 ${activeTab === "outgoing" ? "text-accent border-accent" : "border-transparent text-muted hover:text-foreground"}`}
        >
          My Requests
        </button>
        <button 
          onClick={() => setActiveTab("active")}
          className={`pb-4 font-medium transition-colors border-b-2 ${activeTab === "active" ? "text-accent border-accent" : "border-transparent text-muted hover:text-foreground"}`}
        >
          Active Exchanges
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={`pb-4 font-medium transition-colors border-b-2 ${activeTab === "history" ? "text-accent border-accent" : "border-transparent text-muted hover:text-foreground"}`}
        >
          History
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-serif text-foreground">Loading exchanges...</h2>
          <p className="text-muted mt-2">Fetching the latest request statuses.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req, i) => (
            <div key={i} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex gap-6 items-center">
                <div 
                  className="w-16 h-24 bg-[var(--accent)] rounded-r-md rounded-l-sm shadow-sm border-l-[6px] border-black/20 relative overflow-hidden flex-shrink-0"
                  style={{ backgroundImage: `url(${req.cover_image || `https://covers.openlibrary.org/b/title/${encodeURIComponent(req.title)}-L.jpg`})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
                <div>
                  <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${req.status === 'pending' ? 'text-accent' : req.status === 'accepted' ? 'text-green-600' : req.status === 'exchange_completed' || req.status === 'returned' ? 'text-muted' : 'text-red-600'}`}>
                    {req.status === 'exchange_completed' ? 'Completed' : req.status} Request
                  </p>
                  <h3 className="font-serif text-2xl text-foreground mb-1">{req.title}</h3>
                  <p className="text-muted text-sm mb-3">Requested by <span className="font-medium text-foreground">{req.requester_id || "Reader"}</span></p>
                </div>
              </div>
              
              {activeTab === "incoming" && req.status === 'pending' ? (
                <div className="flex flex-row md:flex-col gap-3">
                  <button onClick={() => handleAcceptRequest(req.request_id)} className="dashboard-btn flex-1 md:flex-none">
                    <Check size={18} /> Accept
                  </button>
                  <button onClick={() => handleRejectRequest(req.request_id)} className="dashboard-btn flex-1 md:flex-none !border-solid !border-border !bg-transparent !text-foreground hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200">
                    <X size={18} /> Decline
                  </button>
                </div>
              ) : req.status === 'accepted' || req.status === 'picked_up' || req.status === 'currently_reading' ? (
                <div className="flex flex-col items-end gap-2">
                  <div className="text-green-600 font-medium flex items-center gap-2"><Check size={20}/> {req.status === 'accepted' ? 'Accepted' : 'Active'}</div>
                  <button 
                    onClick={() => handleReturnBook(req.request_id)}
                    className="dashboard-btn"
                  >
                    Complete Exchange (Mark as Returned)
                  </button>
                </div>
              ) : req.status === 'exchange_completed' || req.status === 'returned' ? (
                <div className="text-muted font-medium flex items-center gap-2"><Check size={20}/> Completed Exchange</div>
              ) : req.status === 'rejected' ? (
                <div className="text-red-600 font-medium flex items-center gap-2"><X size={20}/> Declined</div>
              ) : (
                <div className="text-accent font-medium flex items-center gap-2">Pending...</div>
              )}
            </div>
          ))}
          {requests.length === 0 && (
            <div className="text-center py-20 text-muted">
              <h3 className="font-serif text-2xl mb-2">No exchanges found</h3>
              <p>You don't have any requests in this tab.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
