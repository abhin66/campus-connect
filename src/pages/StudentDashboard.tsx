import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText, Users, Search, MessageSquare, CalendarCheck, Calendar, BookOpen, Star
} from "lucide-react";

const cards = [
  { path: "/notices", label: "Notice Board", desc: "View campus announcements.", icon: FileText },
  { path: "/buddy", label: "Buddy Finder", desc: "Find study and project partners.", icon: Users },
  { path: "/lost-found", label: "Lost & Found", desc: "Report or find lost items.", icon: Search },
  { path: "/complaints", label: "Complaints", desc: "Submit campus complaints.", icon: MessageSquare },
  { path: "/attendance", label: "Attendance", desc: "View your attendance record.", icon: CalendarCheck },
  { path: "/events", label: "Events", desc: "Browse upcoming campus events.", icon: Calendar },
  { path: "/courses", label: "Courses", desc: "Explore and enroll in courses.", icon: BookOpen },
  { path: "/feedback", label: "Feedback", desc: "Share your campus experience.", icon: Star },
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { studentName } = useAuth();

  return (
    <AppLayout>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
        Welcome, {studentName}
      </h1>
      <p className="text-muted-foreground mb-8">Access your campus services and utilities.</p>

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

export default StudentDashboard;
