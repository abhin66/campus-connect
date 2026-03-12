import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader, EmptyState, useConfirm } from "@/components/SharedUI";
import { useAuth } from "@/contexts/AuthContext";
import { getStore, setStore, generateId } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus } from "lucide-react";

interface LFItem {
  id: string; type: "lost" | "found"; itemName: string; description: string; location: string; contact: string;
}

const LostFound = () => {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const [items, setItems] = useState<LFItem[]>(() => getStore("cc_lostfound", []));
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<"lost" | "found">("lost");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const { confirm, dialog } = useConfirm();

  const save = (u: LFItem[]) => { setItems(u); setStore("cc_lostfound", u); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    save([{ id: generateId(), type, itemName, description, location, contact }, ...items]);
    setItemName(""); setDescription(""); setLocation(""); setContact(""); setShowForm(false);
  };

  const handleClaim = (id: string) => save(items.filter(i => i.id !== id));
  const handleRemove = async (id: string) => { if (await confirm()) save(items.filter(i => i.id !== id)); };

  return (
    <AppLayout>
      {dialog}
      <PageHeader title="Lost & Found">
        {!isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="btn-campus-primary gap-2">
            <Plus size={16} /> Post Item
          </button>
        )}
      </PageHeader>

      <AnimatePresence>
        {showForm && !isAdmin && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="campus-card mb-6 space-y-4">
            <div className="flex gap-3">
              <button type="button" onClick={() => setType("lost")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === "lost" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>Lost Item</button>
              <button type="button" onClick={() => setType("found")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === "found" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>Found Item</button>
            </div>
            <input className="input-campus" placeholder="Item name" value={itemName} onChange={e => setItemName(e.target.value)} />
            <textarea className="input-campus min-h-[80px] resize-none" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <input className="input-campus" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
            <input className="input-campus" placeholder="Contact info" value={contact} onChange={e => setContact(e.target.value)} />
            <div className="flex gap-3">
              <button type="submit" className="btn-campus-primary">Post</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-campus-secondary">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {items.length === 0 ? (
        <EmptyState icon={Search} message="No lost or found items reported." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {items.map(item => (
              <motion.div key={item.id} layout exit={{ opacity: 0, height: 0 }} className="campus-card">
                <span className={`badge-campus mb-2 ${item.type === "lost" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                  {item.type === "lost" ? "Lost" : "Found"}
                </span>
                <h3 className="font-semibold text-foreground mt-1">{item.itemName}</h3>
                {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                <p className="text-xs text-muted-foreground mt-2">{item.location} · {item.contact}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleClaim(item.id)} className="btn-campus-success text-sm px-4 py-2">Item Claimed</button>
                  {isAdmin && <button onClick={() => handleRemove(item.id)} className="btn-campus-destructive text-sm px-4 py-2">Remove</button>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </AppLayout>
  );
};

export default LostFound;
