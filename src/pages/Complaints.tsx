import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader, EmptyState } from "@/components/SharedUI";
import { useAuth } from "@/contexts/AuthContext";
import { getStore, setStore, generateId } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, CheckCircle } from "lucide-react";

interface Complaint { id: string; name: string; category: string; description: string; date: string; }

const CATEGORIES = ["Library", "Classroom", "Canteen", "Other"];

const Complaints = () => {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const [complaints, setComplaints] = useState<Complaint[]>(() => getStore("cc_complaints", []));
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");

  const save = (u: Complaint[]) => { setComplaints(u); setStore("cc_complaints", u); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    save([{ id: generateId(), name, category, description, date: new Date().toLocaleDateString() }, ...complaints]);
    setName(""); setDescription(""); setShowForm(false);
  };

  const handleResolve = (id: string) => save(complaints.filter(c => c.id !== id));

  return (
    <AppLayout>
      <PageHeader title="Complaints">
        {!isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="btn-campus-primary gap-2">
            <Plus size={16} /> Submit Complaint
          </button>
        )}
      </PageHeader>

      <AnimatePresence>
        {showForm && !isAdmin && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="campus-card mb-6 space-y-4">
            <input className="input-campus" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            <select className="input-campus" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea className="input-campus min-h-[100px] resize-none" placeholder="Describe your complaint" value={description} onChange={e => setDescription(e.target.value)} />
            <div className="flex gap-3">
              <button type="submit" className="btn-campus-primary">Submit</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-campus-secondary">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {complaints.length === 0 ? (
        <EmptyState icon={MessageSquare} message="No complaints submitted." />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {complaints.map(c => (
              <motion.div key={c.id} layout exit={{ opacity: 0, height: 0 }} className="campus-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-campus bg-secondary text-secondary-foreground">{c.category}</span>
                      <span className="text-xs text-muted-foreground">{c.date}</span>
                    </div>
                    <h3 className="font-semibold text-foreground">{c.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleResolve(c.id)} className="btn-campus-success shrink-0 gap-2 text-sm px-4 py-2">
                      <CheckCircle size={14} /> Resolved
                    </button>
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

export default Complaints;
