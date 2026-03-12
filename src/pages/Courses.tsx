import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader, EmptyState, useConfirm } from "@/components/SharedUI";
import { useAuth } from "@/contexts/AuthContext";
import { getStore, setStore, generateId } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Trash2, CheckCircle } from "lucide-react";

interface Course { id: string; name: string; instructor: string; duration: string; description: string; enrolled: string[]; }

const Courses = () => {
  const { role, studentName } = useAuth();
  const isAdmin = role === "admin";
  const [courses, setCourses] = useState<Course[]>(() => getStore("cc_courses", []));
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const { confirm, dialog } = useConfirm();

  const save = (u: Course[]) => { setCourses(u); setStore("cc_courses", u); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    save([{ id: generateId(), name, instructor, duration, description, enrolled: [] }, ...courses]);
    setName(""); setInstructor(""); setDuration(""); setDescription(""); setShowForm(false);
  };

  const handleDelete = async (id: string) => { if (await confirm()) save(courses.filter(c => c.id !== id)); };

  const handleEnroll = (id: string) => {
    save(courses.map(c => {
      if (c.id !== id) return c;
      const already = c.enrolled.includes(studentName);
      return { ...c, enrolled: already ? c.enrolled.filter(n => n !== studentName) : [...c.enrolled, studentName] };
    }));
  };

  return (
    <AppLayout>
      {dialog}
      <PageHeader title="Courses">
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="btn-campus-primary gap-2">
            <Plus size={16} /> Add Course
          </button>
        )}
      </PageHeader>

      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="campus-card mb-6 space-y-4">
            <input className="input-campus" placeholder="Course name" value={name} onChange={e => setName(e.target.value)} />
            <input className="input-campus" placeholder="Instructor" value={instructor} onChange={e => setInstructor(e.target.value)} />
            <input className="input-campus" placeholder="Duration (e.g., 3 months)" value={duration} onChange={e => setDuration(e.target.value)} />
            <textarea className="input-campus min-h-[80px] resize-none" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <div className="flex gap-3">
              <button type="submit" className="btn-campus-primary">Add Course</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-campus-secondary">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {courses.length === 0 ? (
        <EmptyState icon={BookOpen} message="No courses available." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {courses.map(c => (
              <motion.div key={c.id} layout exit={{ opacity: 0, height: 0 }} className="campus-card">
                <h3 className="font-semibold text-foreground">{c.name}</h3>
                {c.instructor && <p className="text-sm text-muted-foreground mt-1">Instructor: {c.instructor}</p>}
                {c.duration && <p className="text-xs text-muted-foreground">{c.duration}</p>}
                {c.description && <p className="text-sm text-muted-foreground mt-2">{c.description}</p>}
                <div className="mt-4 flex items-center justify-between">
                  {!isAdmin && (
                    <button
                      onClick={() => handleEnroll(c.id)}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${c.enrolled.includes(studentName) ? "bg-success text-primary-foreground" : "bg-primary text-primary-foreground"}`}
                    >
                      {c.enrolled.includes(studentName) && <CheckCircle size={14} />}
                      {c.enrolled.includes(studentName) ? "Enrolled" : "Enroll"}
                    </button>
                  )}
                  {isAdmin && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{c.enrolled.length} enrolled</span>
                      <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
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

export default Courses;
