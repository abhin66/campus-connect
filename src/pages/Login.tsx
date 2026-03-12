import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Shield, AlertCircle } from "lucide-react";

const ADMIN_EMAIL = "admin@campus.com";
const ADMIN_PASSWORD = "admin123";

const Login = () => {
  const { login, role } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"student" | "admin">("student");
  const [studentName, setStudentName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  if (role) {
    navigate(role === "admin" ? "/admin" : "/student", { replace: true });
    return null;
  }

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) { setError("Please enter your name or student ID."); return; }
    if (!studentPassword.trim()) { setError("Please enter your password."); return; }
    if (studentPassword !== "student123") { setError("Invalid password."); return; }
    login("student", studentName.trim());
    navigate("/student");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === ADMIN_EMAIL && adminPassword === ADMIN_PASSWORD) {
      login("admin");
      navigate("/admin");
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Campus Connect</h1>
          <p className="text-muted-foreground mt-2 text-sm">Sign in to access campus services.</p>
        </div>

        <div className="campus-card-elevated">
          {/* Tab switcher */}
          <div className="flex rounded-lg bg-secondary p-1 mb-6">
            <button
              onClick={() => { setTab("student"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all duration-200 ${tab === "student" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              <GraduationCap size={16} /> Student
            </button>
            <button
              onClick={() => { setTab("admin"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all duration-200 ${tab === "admin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              <Shield size={16} /> Admin
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 bg-destructive/10 text-destructive rounded-lg px-4 py-3 mb-4 text-sm"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          {tab === "student" ? (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Student Name or ID</label>
                <input
                  className="input-campus"
                  placeholder="Enter your name or student ID"
                  value={studentName}
                  onChange={(e) => { setStudentName(e.target.value); setError(""); }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <input
                  type="password"
                  className="input-campus"
                  placeholder="Enter password"
                  value={studentPassword}
                  onChange={(e) => { setStudentPassword(e.target.value); setError(""); }}
                />
              </div>
              <button type="submit" className="btn-campus-primary w-full">Sign In as Student</button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Admin Email</label>
                <input
                  type="email"
                  className="input-campus"
                  placeholder="admin@campus.com"
                  value={adminEmail}
                  onChange={(e) => { setAdminEmail(e.target.value); setError(""); }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <input
                  type="password"
                  className="input-campus"
                  placeholder="Enter password"
                  value={adminPassword}
                  onChange={(e) => { setAdminPassword(e.target.value); setError(""); }}
                />
              </div>
              <button type="submit" className="btn-campus-primary w-full">Sign In as Admin</button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
