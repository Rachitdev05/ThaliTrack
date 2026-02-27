import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";

const Verify = () => {
  const [otp, setOtp] = useState("");
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
      </div>
    </div>
  );
};

export default Verify;