"use client";

import { useEffect, useState } from "react";
import { MessageSquareOff, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Messages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("bindr_token");
        const [inRes, outRes] = await Promise.all([
          fetch("http://localhost:5000/requests/incoming", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:5000/requests/outgoing", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        let combinedMessages = [];
        if (inRes.ok) {
          const inData = await inRes.json();
          const pendingIn = inData.filter((r: any) => r.status === 'pending').map((r: any) => ({ ...r, msgType: 'incoming_request' }));
          combinedMessages = [...combinedMessages, ...pendingIn];
        }
        if (outRes.ok) {
          const outData = await outRes.json();
          const acceptedOut = outData.filter((r: any) => r.status === 'accepted').map((r: any) => ({ ...r, msgType: 'outgoing_accepted' }));
          combinedMessages = [...combinedMessages, ...acceptedOut];
        }
        
        setMessages(combinedMessages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="p-8 max-w-[1000px] mx-auto text-foreground min-h-screen">
      <header className="mb-10">
        <h1 className="font-serif text-4xl text-foreground mb-2">Messages</h1>
        <p className="text-muted text-lg">System notifications and requests from readers.</p>
      </header>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading messages...</p>
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-[#E8DCC8] rounded-full flex items-center justify-center text-accent shrink-0 mt-1">
                <MessageSquare size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg">{msg.msgType === 'incoming_request' ? 'Borrow Request' : 'Request Accepted!'}</h3>
                  <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-1 rounded-full">New</span>
                </div>
                <p className="text-muted mb-4">
                  {msg.msgType === 'incoming_request' ? (
                    <><span className="font-medium text-foreground">{msg.requester_name || `User ${msg.requester_id}`}</span> is requesting to borrow your book <span className="font-medium text-foreground">&quot;{msg.title}&quot;</span>.</>
                  ) : (
                    <>Your request to borrow <span className="font-medium text-foreground">&quot;{msg.title}&quot;</span> has been accepted! You can now arrange to pick it up.</>
                  )}
                </p>
                <Link href="/dashboard/exchanges" className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-accent-hover transition-colors">
                  Go to Exchanges <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-[#E8DCC8] rounded-full flex items-center justify-center text-accent mb-6">
            <MessageSquareOff size={40} strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-3xl text-foreground mb-3">No New Messages</h2>
          <p className="text-muted text-lg max-w-md">When you start an exchange or connect with other readers, your conversations will appear here.</p>
        </div>
      )}
    </div>
  );
}
