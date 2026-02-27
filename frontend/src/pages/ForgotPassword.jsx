import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/forgot-password", { email });
      toast.success("OTP sent! Check your email.");
      navigate("/reset-password", { state: { email } }); // Pass email to next page
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Forgot Password? 🔒</h2>
        <p className="text-gray-500 mb-6">Enter your email to receive a reset code.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg" required />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Send OTP</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;