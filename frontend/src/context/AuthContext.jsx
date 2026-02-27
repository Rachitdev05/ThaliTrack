import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (Data saved in LocalStorage)
    const storedUser = localStorage.getItem("thaliUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Set the token for all Axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("thaliUser", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("thaliUser");
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;