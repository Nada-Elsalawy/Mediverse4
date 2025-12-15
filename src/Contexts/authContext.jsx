
import React, { createContext, useState, useEffect } from 'react';

export const authContext = createContext();

export default function AuthContextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // localStorage عند تحميل الصفحة
  useEffect(() => {
    const patient = localStorage.getItem("patient");
    if (patient) {
      setIsLoggedIn(true);
    }
  }, []);

  //  دالة لتسجيل الدخول
  const login = (patientData) => {
    localStorage.setItem("patient", JSON.stringify(patientData));
    setIsLoggedIn(true);
  };

  //  دالة لتسجيل الخروج
  const logout = () => {
    localStorage.removeItem("patient");
    localStorage.removeItem("capturedFaceImage");
    setIsLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </authContext.Provider>
  );
}