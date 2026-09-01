import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // In-memory role state (NO localStorage)
  const [userRole, setUserRole] = useState(null); // 'Policymaker' | 'District Administrator' | 'Field Officer' | null
  const [userName, setUserName] = useState('');

  const login = (role, name = 'Officer') => {
    setUserRole(role);
    setUserName(name || 'Officer');
  };

  const logout = () => {
    setUserRole(null);
    setUserName('');
  };

  return (
    <AuthContext.Provider value={{ userRole, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
