import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader, EmptyState } from "@/components/SharedUI";
import { useAuth } from "@/contexts/AuthContext";
import { getStore, setStore, generateId } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus } from "lucide-react";

interface BuddyRequest {
  id: string; name: string; interest: string; note: string; contact: string;
  status: "open" | "sent" | "connected";
}

const INTERESTS = ["Study", "Project", "Hackathon", "Coding"];

const BuddyFinder = () => {
  const { studentName } = useAuth();
  const [requests, setRequests] = useState<BuddyRequest[]>(() => getStore("cc_buddy", []));
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [interest, setInterest] = useState(INTERESTS[0]);
  const [note, setNote] = useState("");
  const [contact, setContact] = useState("");

  const save = (updated: BuddyRequest[]) => { setRequests(updated); setStore("cc_buddy", updated); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    save([{ id: generateId(), name, interest, note, contact, status: "open" }, ...requests]);
    setName(""); setNote(""); setContact(""); setShowForm(false);
  };

  const handleConnect = (id: string) => save(requests.map(r => r.id === id ? { ...r, status: "sent" as const } : r));
  const handleConnected = (id: string) => save(requests.filter(r => r.id !== id));

  return (
    <AppLayout>
      <PageHeader title="Buddy Finder">
        <button onClick={() => setShowForm(!showForm)} className="btn-campus-primary gap-2">
          <Plus size={16} /> Post Request
        </button>
      </PageHeader>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="campus-card mb-6 space-y-4"
          >
            <input className="input-campus" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            <select className="input-campus" value={interest} onChange={e => setInterest(e.target.value)}>
              {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <input className="input-campus" placeholder="Short note" value={note} onChange={e => setNote(e.target.value)} />
            <input className="input-campus" placeholder="Contact info" value={contact} onChange={e => setContact(e.target.value)} />
            <div className="flex gap-3">
              <button type="submit" className="btn-campus-primary">Post Request</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-campus-secondary">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {requests.length === 0 ? (
        <EmptyState icon={Users} message="No buddy requests yet. Be the first to post one." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {requests.map(r => (
              <motion.div key={r.id} layout exit={{ opacity: 0, height: 0 }} className="campus-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge-campus bg-secondary text-secondary-foreground">{r.interest}</span>
                </div>
                <h3 className="font-semibold text-foreground">{r.name}</h3>
                {r.note && <p className="text-sm text-muted-foreground mt-1">{r.note}</p>}
                <p className="text-xs text-muted-foreground mt-2">{r.contact}</p>
                <div className="mt-4">
                  {r.status === "open" && (
                    <button onClick={() => handleConnect(r.id)} className="btn-campus-primary text-sm px-4 py-2">Connect</button>
                  )}
                  {r.status === "sent" && (
                    <button onClick={() => handleConnected(r.id)} className="btn-campus-success text-sm px-4 py-2">We Connected</button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </AppLayout>
  );
};

export default BuddyFinder;
