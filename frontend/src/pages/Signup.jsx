import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false); // <--- NEW STATE
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // <--- START LOADING

    try {
      await axios.post("/api/auth/signup", formData);
      toast.success("OTP sent to your email! 📧");
      // Redirect to Verify Page with email state
      navigate("/verify", { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      setIsLoading(false); // <--- STOP LOADING ON ERROR
    }
    // Note: We don't stop loading on success because we navigate away immediately
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-green-700 mb-2">Create Account 🚀</h1>
        <p className="text-gray-500 mb-6">Join ThaliTrack to start your journey.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input 
                type="text" 
                placeholder="e.g. Sachin" 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" 
                required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input 
                type="email" 
                placeholder="your@email.com" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" 
                required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
                type="password" 
                placeholder="••••••••" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" 
                required 
            />
          </div>

          {/* --- NEW BUTTON WITH LOADING STATE --- */}
          <button 
            type="submit" 
            disabled={isLoading} // Prevent clicks while loading
            className={`w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md
              ${isLoading 
                ? "bg-green-400 cursor-not-allowed text-white/90" 
                : "bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02]"
              }`}
          >
            {isLoading ? (
              <>
                {/* SVG SPINNER ICON */}
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing Up...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-green-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;