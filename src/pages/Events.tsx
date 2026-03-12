import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader, EmptyState, useConfirm } from "@/components/SharedUI";
import { useAuth } from "@/contexts/AuthContext";
import { getStore, setStore, generateId } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, Trash2, Heart } from "lucide-react";

interface CampusEvent { id: string; name: string; description: string; date: string; location: string; interested: string[]; }

const Events = () => {
  const { role, studentName } = useAuth();
  const isAdmin = role === "admin";
  const [events, setEvents] = useState<CampusEvent[]>(() => getStore("cc_events", []));
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const { confirm, dialog } = useConfirm();

  const save = (u: CampusEvent[]) => { setEvents(u); setStore("cc_events", u); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    save([{ id: generateId(), name, description, date, location, interested: [] }, ...events]);
    setName(""); setDescription(""); setDate(""); setLocation(""); setShowForm(false);
  };

  const handleDelete = async (id: string) => { if (await confirm()) save(events.filter(e => e.id !== id)); };

  const handleInterested = (id: string) => {
    save(events.map(e => {
      if (e.id !== id) return e;
      const already = e.interested.includes(studentName);
      return { ...e, interested: already ? e.interested.filter(n => n !== studentName) : [...e.interested, studentName] };
    }));
  };

  return (
    <AppLayout>
      {dialog}
      <PageHeader title="Events">
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="btn-campus-primary gap-2">
            <Plus size={16} /> Add Event
          </button>
        )}
      </PageHeader>

      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="campus-card mb-6 space-y-4">
            <input className="input-campus" placeholder="Event name" value={name} onChange={e => setName(e.target.value)} />
            <textarea className="input-campus min-h-[80px] resize-none" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <input className="input-campus" type="date" value={date} onChange={e => setDate(e.target.value)} />
            <input className="input-campus" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
            <div className="flex gap-3">
              <button type="submit" className="btn-campus-primary">Add Event</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-campus-secondary">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {events.length === 0 ? (
        <EmptyState icon={Calendar} message="No events scheduled." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {events.map(ev => (
              <motion.div key={ev.id} layout exit={{ opacity: 0, height: 0 }} className="campus-card">
                <h3 className="font-semibold text-foreground">{ev.name}</h3>
                {ev.description && <p className="text-sm text-muted-foreground mt-1">{ev.description}</p>}
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  {ev.date && <span>{ev.date}</span>}
                  {ev.location && <span>· {ev.location}</span>}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  {!isAdmin && (
                    <button
                      onClick={() => handleInterested(ev.id)}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${ev.interested.includes(studentName) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"}`}
                    >
                      <Heart size={14} fill={ev.interested.includes(studentName) ? "currentColor" : "none"} />
                      Interested {ev.interested.length > 0 && `(${ev.interested.length})`}
                    </button>
                  )}
                  {isAdmin && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{ev.interested.length} interested</span>
                      <button onClick={() => handleDelete(ev.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
                    </div>
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

export default Events;
