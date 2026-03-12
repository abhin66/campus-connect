import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader, EmptyState, useConfirm } from "@/components/SharedUI";
import { useAuth } from "@/contexts/AuthContext";
import { getStore, setStore, generateId } from "@/lib/store";
import { motion } from "framer-motion";
import { CalendarCheck, Plus, Trash2, Search } from "lucide-react";

interface AttendanceRecord { id: string; studentName: string; status: "Present" | "Absent"; date: string; }

const Attendance = () => {
  const { role, studentName } = useAuth();
  const isAdmin = role === "admin";
  const [records, setRecords] = useState<AttendanceRecord[]>(() => getStore("cc_attendance", []));
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"Present" | "Absent">("Present");
  const [searchName, setSearchName] = useState(isAdmin ? "" : studentName);
  const { confirm, dialog } = useConfirm();

  const save = (u: AttendanceRecord[]) => { setRecords(u); setStore("cc_attendance", u); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    save([...records, { id: generateId(), studentName: name.trim(), status, date: new Date().toLocaleDateString() }]);
    setName(""); setShowForm(false);
  };

  const handleDelete = async (id: string) => { if (await confirm()) save(records.filter(r => r.id !== id)); };

  // Student stats
  const studentRecords = records.filter(r => r.studentName.toLowerCase() === searchName.toLowerCase());
  const total = studentRecords.length;
  const present = studentRecords.filter(r => r.status === "Present").length;
  const absent = total - present;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <AppLayout>
      {dialog}
      <PageHeader title="Attendance">
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="btn-campus-primary gap-2">
            <Plus size={16} /> Add Record
          </button>
        )}
      </PageHeader>

      {isAdmin && showForm && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="campus-card mb-6 space-y-4">
          <input className="input-campus" placeholder="Student name" value={name} onChange={e => setName(e.target.value)} />
          <div className="flex gap-3">
            <button type="button" onClick={() => setStatus("Present")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${status === "Present" ? "bg-success text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>Present</button>
            <button type="button" onClick={() => setStatus("Absent")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${status === "Absent" ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"}`}>Absent</button>
          </div>
          <p className="text-xs text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
          <div className="flex gap-3">
            <button type="submit" className="btn-campus-primary">Add</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-campus-secondary">Cancel</button>
          </div>
        </motion.form>
      )}

      {!isAdmin && (
        <div className="mb-6">
          <div className="campus-card">
            <div className="flex items-center gap-3 mb-4">
              <Search size={16} className="text-muted-foreground" />
              <input className="input-campus" placeholder="Enter your name" value={searchName} onChange={e => setSearchName(e.target.value)} />
            </div>
            {searchName && total > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-secondary rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{total}</p>
                  <p className="text-xs text-muted-foreground">Total Classes</p>
                </div>
                <div className="bg-secondary rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-success">{present}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div className="bg-secondary rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-destructive">{absent}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
                <div className="bg-secondary rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{percentage}%</p>
                  <p className="text-xs text-muted-foreground">Attendance</p>
                </div>
              </div>
            ) : searchName ? (
              <p className="text-sm text-muted-foreground">No attendance records found for "{searchName}".</p>
            ) : null}
          </div>
        </div>
      )}

      {isAdmin && (
        records.length === 0 ? (
          <EmptyState icon={CalendarCheck} message="No attendance records yet." />
        ) : (
          <div className="campus-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-foreground font-medium">{r.studentName}</td>
                    <td className="py-3 px-4">
                      <span className={`badge-campus ${r.status === "Present" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{r.date}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </AppLayout>
  );
};

export default Attendance;
