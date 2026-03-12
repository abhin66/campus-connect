import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, FileText, Users, Search, MessageSquare,
  CalendarCheck, Calendar, BookOpen, Star, LogOut, Menu, X, ArrowLeft
} from "lucide-react";

const allLinks = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { path: "/student", label: "Dashboard", icon: LayoutDashboard, roles: ["student"] },
  { path: "/notices", label: "Notice Board", icon: FileText, roles: ["admin", "student"] },
  { path: "/buddy", label: "Buddy Finder", icon: Users, roles: ["student"] },
  { path: "/lost-found", label: "Lost & Found", icon: Search, roles: ["admin", "student"] },
  { path: "/complaints", label: "Complaints", icon: MessageSquare, roles: ["admin", "student"] },
  { path: "/attendance", label: "Attendance", icon: CalendarCheck, roles: ["admin", "student"] },
  { path: "/events", label: "Events", icon: Calendar, roles: ["admin", "student"] },
  { path: "/courses", label: "Courses", icon: BookOpen, roles: ["admin", "student"] },
  { path: "/feedback", label: "Feedback", icon: Star, roles: ["admin", "student"] },
];

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { role, logout, studentName } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = allLinks.filter((l) => l.roles.includes(role!));
  const dashboardPath = role === "admin" ? "/admin" : "/student";
  const isOnDashboard = location.pathname === dashboardPath;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-card px-4 py-3 md:hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <span className="text-lg font-bold text-foreground">Campus Connect</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg text-muted-foreground hover:bg-secondary">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav className={`fixed inset-y-0 left-0 z-40 w-64 bg-card p-4 flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="mb-8 mt-2">
          <h1 className="text-xl font-bold text-foreground">Campus Connect</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {role === "admin" ? "Administrator" : studentName}
          </p>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setSidebarOpen(false); }}
                className={`nav-link-campus w-full ${isActive ? "active" : ""}`}
              >
                <link.icon size={18} />
                <span className="text-sm font-medium">{link.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border space-y-1">
          {!isOnDashboard && (
            <button onClick={() => navigate(dashboardPath)} className="nav-link-campus w-full">
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
          )}
          <button onClick={handleLogout} className="nav-link-campus w-full text-destructive hover:bg-destructive/10">
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
