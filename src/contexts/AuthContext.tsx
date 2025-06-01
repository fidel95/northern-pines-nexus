
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Admin {
  id: number;
  username: string;
  password: string;
  createdAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentAdmin: Admin | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addAdmin: (username: string, password: string) => boolean;
  getAdmins: () => Admin[];
  deleteAdmin: (id: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    // Initialize default admin if no admins exist
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    if (admins.length === 0) {
      const defaultAdmin: Admin = {
        id: 1,
        username: 'admin',
        password: 'admin',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('admins', JSON.stringify([defaultAdmin]));
    }

    // Check if user is already logged in
    const authToken = localStorage.getItem('authToken');
    const adminId = localStorage.getItem('currentAdminId');
    if (authToken && adminId) {
      const admin = admins.find((a: Admin) => a.id === parseInt(adminId));
      if (admin) {
        setIsAuthenticated(true);
        setCurrentAdmin(admin);
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const admins: Admin[] = JSON.parse(localStorage.getItem('admins') || '[]');
    const admin = admins.find(a => a.username === username && a.password === password);
    
    if (admin) {
      setIsAuthenticated(true);
      setCurrentAdmin(admin);
      localStorage.setItem('authToken', 'authenticated');
      localStorage.setItem('currentAdminId', admin.id.toString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentAdmin(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentAdminId');
  };

  const addAdmin = (username: string, password: string): boolean => {
    const admins: Admin[] = JSON.parse(localStorage.getItem('admins') || '[]');
    
    // Check if username already exists
    if (admins.some(a => a.username === username)) {
      return false;
    }

    const newAdmin: Admin = {
      id: Date.now(),
      username,
      password,
      createdAt: new Date().toISOString()
    };

    const updatedAdmins = [...admins, newAdmin];
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    return true;
  };

  const getAdmins = (): Admin[] => {
    return JSON.parse(localStorage.getItem('admins') || '[]');
  };

  const deleteAdmin = (id: number) => {
    const admins: Admin[] = JSON.parse(localStorage.getItem('admins') || '[]');
    const updatedAdmins = admins.filter(a => a.id !== id);
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      currentAdmin,
      login,
      logout,
      addAdmin,
      getAdmins,
      deleteAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
