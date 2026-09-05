import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(null); // 'Policymaker' | 'District Administrator' | 'Field Officer' | 'Central Administration' | null
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCadre, setUserCadre] = useState('');
  const [userDesignation, setUserDesignation] = useState('');

  const login = (roleOrUserObject, name = 'Officer') => {
    if (typeof roleOrUserObject === 'object' && roleOrUserObject !== null) {
      setUserRole(roleOrUserObject.role);
      setUserName(roleOrUserObject.name || 'Officer');
      setUserEmail(roleOrUserObject.email || '');
      setUserCadre(roleOrUserObject.cadre || '');
      setUserDesignation(roleOrUserObject.designation || '');
    } else {
      setUserRole(roleOrUserObject);
      setUserName(name || 'Officer');
      setUserEmail('');
      setUserCadre('');
      setUserDesignation('');
    }
  };

  const logout = () => {
    setUserRole(null);
    setUserName('');
    setUserEmail('');
    setUserCadre('');
    setUserDesignation('');
  };

  return (
    <AuthContext.Provider
      value={{
        userRole,
        userName,
        userEmail,
        userCadre,
        userDesignation,
        login,
        logout,
      }}
    >
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
