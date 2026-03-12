import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Role = "admin" | "student" | null;

interface AuthContextType {
  role: Role;
  studentName: string;
  login: (role: Role, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  studentName: "",
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem("cc_role") as Role) || null;
  });
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem("cc_student_name") || "";
  });

  const login = (r: Role, name?: string) => {
    setRole(r);
    localStorage.setItem("cc_role", r || "");
    if (name) {
      setStudentName(name);
      localStorage.setItem("cc_student_name", name);
    }
  };

  const logout = () => {
    setRole(null);
    setStudentName("");
    localStorage.removeItem("cc_role");
    localStorage.removeItem("cc_student_name");
  };

  return (
    <AuthContext.Provider value={{ role, studentName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
