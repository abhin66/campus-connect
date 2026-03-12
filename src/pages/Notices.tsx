import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader, EmptyState, useConfirm } from "@/components/SharedUI";
import { useAuth } from "@/contexts/AuthContext";
import { getStore, setStore, generateId } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Pencil, Trash2 } from "lucide-react";

interface Notice { id: string; title: string; description: string; date: string; }

const Notices = () => {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const [notices, setNotices] = useState<Notice[]>(() => getStore("cc_notices", []));
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { confirm, dialog } = useConfirm();

  const save = (updated: Notice[]) => { setNotices(updated); setStore("cc_notices", updated); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    const date = new Date().toLocaleDateString();
    if (editId) {
      save(notices.map(n => n.id === editId ? { ...n, title, description, date } : n));
    } else {
      save([{ id: generateId(), title, description, date }, ...notices]);
    }
    resetForm();
  };

  const resetForm = () => { setTitle(""); setDescription(""); setEditId(null); setShowForm(false); };

  const handleEdit = (n: Notice) => { setTitle(n.title); setDescription(n.description); setEditId(n.id); setShowForm(true); };

  const handleDelete = async (id: string) => {
    if (await confirm()) save(notices.filter(n => n.id !== id));
  };

  return (
    <AppLayout>
      {dialog}
      <PageHeader title="Notice Board">
        {isAdmin && (
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn-campus-primary gap-2">
            <Plus size={16} /> Add Notice
          </button>
        )}
      </PageHeader>

      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="campus-card mb-6 space-y-4"
          >
            <input className="input-campus" placeholder="Notice title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className="input-campus min-h-[100px] resize-none" placeholder="Notice description" value={description} onChange={e => setDescription(e.target.value)} />
            <div className="flex gap-3">
              <button type="submit" className="btn-campus-primary">{editId ? "Update" : "Add"} Notice</button>
              <button type="button" onClick={resetForm} className="btn-campus-secondary">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {notices.length === 0 ? (
        <EmptyState icon={FileText} message="No notices posted yet." />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {notices.map(n => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="campus-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground">{n.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{n.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">{n.date}</p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleEdit(n)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(n.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
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

export default Notices;
