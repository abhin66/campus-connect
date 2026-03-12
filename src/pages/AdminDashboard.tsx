import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/AppLayout";
import {
  FileText, MessageSquare, Search, CalendarCheck, Calendar, BookOpen, Star
} from "lucide-react";

const cards = [
  { path: "/notices", label: "Manage Notices", desc: "Add, edit, or delete announcements.", icon: FileText },
  { path: "/complaints", label: "Manage Complaints", desc: "View and resolve student complaints.", icon: MessageSquare },
  { path: "/lost-found", label: "Manage Lost & Found", desc: "Remove incorrect posts.", icon: Search },
  { path: "/attendance", label: "Attendance Panel", desc: "Manage attendance records.", icon: CalendarCheck },
  { path: "/events", label: "Manage Events", desc: "Add and delete campus events.", icon: Calendar },
  { path: "/courses", label: "Manage Courses", desc: "Add and delete course listings.", icon: BookOpen },
  { path: "/feedback", label: "View Feedback", desc: "Read student feedback and ratings.", icon: Star },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage campus services and student utilities.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.button
            key={card.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: "spring", duration: 0.5, bounce: 0 }}
            onClick={() => navigate(card.path)}
            className="campus-card text-left group cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="bg-secondary p-3 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                <card.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-foreground">{card.label}</h2>
                <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
