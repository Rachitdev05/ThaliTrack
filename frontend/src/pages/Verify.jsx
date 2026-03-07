import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false); // New State  
  const { login } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // Get email passed from Signup page

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/verify", { email, otp });
      login(data); // Log the user in immediately
      toast.success("Verified! Welcome to ThaliTrack 🎉");
      navigate("/");
    } catch (error) {
      toast.error("Invalid OTP");
    }
  };

  
  // NEW FUNCTION: RESEND OTP
  const handleResend = async () => {
    setResending(true);
    try {
      // We can actually call the Signup endpoint again with the same data if we saved it, 
      // OR better, create a specific resend endpoint. 
      // For simplicity, let's use the new Signup Logic we just wrote (Case B).
      
      // Ideally, we need the password again, but we don't have it here. 
      // So let's create a dedicated simple resend endpoint in backend quickly.
      
      await axios.post("/api/auth/resend-otp", { email }); 
      toast.success("New OTP sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend");
    } finally {
        setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2">Check your Email 📧</h2>
        <p className="text-gray-500 mb-6">We sent a code to {email}</p>
        <input 
            type="text" 
            placeholder="Enter 6-digit OTP" 
            onChange={(e) => setOtp(e.target.value)} 
            className="w-full p-3 border rounded-lg text-center text-2xl tracking-widest font-bold mb-4" 
            maxLength="6"
        />
        <button onClick={handleVerify} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Verify & Login</button>
         {/* NEW BUTTON */}
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