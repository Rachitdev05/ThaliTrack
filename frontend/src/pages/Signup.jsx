import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/signup", formData);
      toast.success("OTP sent to your email! 📧");
      // Redirect to Verify Page with email state
      navigate("/verify", { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Account 🚀</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-lg" required />
          <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-lg" required />
          <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-3 border rounded-lg" required />
          <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">Sign Up</button>
        </form>
        <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="text-green-600 font-bold">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;