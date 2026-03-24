import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';

// PAGES
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import Tracker from "./pages/Tracker"; // This is your old App code
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import Feedback from "./pages/Feedback";
import AdminFeedback from "./pages/AdminFeedback";

// Protected Route Component
const PrivateRoute = ({ children }) => {
  // WE NOW EXTRACT 'loading' FROM CONTEXT
  const { user, loading } = useContext(AuthContext); 

  // If Context is still checking local storage, show a blank screen or spinner
  // Do NOT redirect yet!
  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <p className="text-gray-400 animate-pulse font-bold">Loading ThaliTrack...</p>
          </div>
      );
  }

  // Once loading is false, THEN check if user exists
  return user ? children : <Navigate to="/login" replace />;
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
          <Route path="/feedback" element={<PrivateRoute><Feedback/></PrivateRoute>}/>
          <Route path="/admin-feedback" element={<AdminFeedback />} />

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