import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader, EmptyState } from "@/components/SharedUI";
import { useAuth } from "@/contexts/AuthContext";
import { getStore, setStore, generateId } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus } from "lucide-react";

interface Feedback { id: string; name: string; message: string; rating: number; date: string; }

const StarRating = ({ value, onChange }: { value: number; onChange?: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(i => (
      <button
        key={i}
        type="button"
        onClick={() => onChange?.(i)}
        className={`${onChange ? "cursor-pointer" : "cursor-default"}`}
      >
        <Star size={20} fill={i <= value ? "hsl(45 93% 47%)" : "none"} stroke={i <= value ? "hsl(45 93% 47%)" : "hsl(var(--muted-foreground))"} />
      </button>
    ))}
  </div>
);

const FeedbackPage = () => {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => getStore("cc_feedback", []));
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);

  const save = (u: Feedback[]) => { setFeedbacks(u); setStore("cc_feedback", u); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    save([{ id: generateId(), name, message, rating, date: new Date().toLocaleDateString() }, ...feedbacks]);
    setName(""); setMessage(""); setRating(5); setShowForm(false);
  };

  return (
    <AppLayout>
      <PageHeader title="Feedback">
        {!isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="btn-campus-primary gap-2">
            <Plus size={16} /> Submit Feedback
          </button>
        )}
      </PageHeader>

      <AnimatePresence>
        {showForm && !isAdmin && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="campus-card mb-6 space-y-4">
            <input className="input-campus" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            <textarea className="input-campus min-h-[100px] resize-none" placeholder="Your feedback" value={message} onChange={e => setMessage(e.target.value)} />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Rating</label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-campus-primary">Submit</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-campus-secondary">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {feedbacks.length === 0 ? (
        <EmptyState icon={Star} message="No feedback submitted yet." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {feedbacks.map(f => (
              <motion.div key={f.id} layout className="campus-card">
                <StarRating value={f.rating} />
                <h3 className="font-semibold text-foreground mt-2">{f.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{f.date}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </AppLayout>
  );
};

export default FeedbackPage;
