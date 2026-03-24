import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);
  const { login } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email; 

  // --- FIX 1: REFRESH CRASH SAFEGUARD ---
  // If the user refreshes the page, 'email' becomes undefined and breaks the app.
  // This sends them back to signup safely.
  useEffect(() => {
    if (!email) {
        navigate('/signup', { replace: true });
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/verify", { email, otp });
      login(data); 
      toast.success("Verified! Welcome to ThaliTrack 🎉");
      
      // --- FIX 2: HISTORY STACK FIX ---
      // replace: true deletes "/verify" from the back-button history
      navigate("/", { replace: true }); 
    } catch (error) {
      toast.error("Invalid OTP");
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post("/api/auth/resend-otp", { email }); 
      toast.success("New OTP sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend");
    } finally {
        setResending(false);
    }
  };

  if (!email) return null; // Prevent rendering if redirecting

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2">Check your Email 📧</h2>
        <p className="text-gray-500 mb-6">We sent a code to {email}</p>
        <input 
            type="text" 
            placeholder="Enter 6-digit OTP" 
            onChange={(e) => setOtp(e.target.value)} 
            className="w-full p-3 border rounded-lg text-center text-2xl tracking-widest font-bold mb-4 outline-none focus:ring-2 focus:ring-blue-500" 
            maxLength="6"
        />
        <button onClick={handleVerify} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition mb-4">
            Verify & Login
        </button>

        <button 
            onClick={handleResend} 
            disabled={resending}
            className="text-sm text-blue-500 hover:underline disabled:text-gray-400"
        >
            {resending ? "Sending..." : "Didn't receive code? Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default Verify;