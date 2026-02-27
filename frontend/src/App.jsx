import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';

// PAGES
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Verify from "./pages/Verify";
import Tracker from "./pages/Tracker"; // This is your old App code
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="bottom-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="reset-password" element={<ResetPassword/>}/>
          <Route path="/profile" element={ <PrivateRoute> <Profile /></PrivateRoute>}/>
          <Route path="/reports" element={<PrivateRoute><Reports/></PrivateRoute>}/>

          {/* Protected Routes (Only for Logged in Users) */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Tracker />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;