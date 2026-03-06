import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  const fetchFeedbacks = async () => {
    try {
        const { data } = await axios.get('/api/feedback/admin');
        setFeedbacks(data);
    } catch (error) {
        alert("Access Denied");
        navigate('/');
    }
  };

  useEffect(() => {
    // 1. Security Check
    const storedUser = JSON.parse(localStorage.getItem('thaliUser'));
    if (!storedUser || !storedUser.isAdmin) {
        toast.error("Admins only! 🚫");
        navigate('/'); // Kick them out to Home
        return;
    }

    // 2. Fetch Data (Only if admin)
    const fetchFeedbacks = async () => {
        try {
            const { data } = await axios.get('/api/feedback/admin');
            setFeedbacks(data);
        } catch (error) {
            toast.error("Error fetching data");
        }
    };
    fetchFeedbacks();
  }, []);

  const markResolved = async (id) => {
      try {
          await axios.put(`/api/feedback/${id}`, { status: 'Resolved' });
          toast.success("Marked as Resolved ✅");
          fetchFeedbacks(); // Refresh list
      } catch (error) {
          toast.error("Error updating status");
      }
  };

  const sendEmail = (email) => {
      window.location.href = `mailto:${email}?subject=Reply to your ThaliTrack Feedback`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">👑 Admin Feedback Panel</h1>
        
        <div className="grid gap-6 max-w-4xl mx-auto">
            {feedbacks.map(f => (
                <div key={f._id} className={`bg-white p-6 rounded-xl shadow-sm border-l-8 ${f.status === 'Resolved' ? 'border-green-500 opacity-75' : 'border-orange-500'}`}>
                    
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{f.type}</span>
                            <h3 className="font-bold text-gray-800 mt-2">{f.user?.name}</h3>
                            <p className="text-xs text-gray-400">{f.email}</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-xs font-bold uppercase ${f.status === 'Resolved' ? 'text-green-600' : 'text-orange-500'}`}>
                                {f.status}
                            </span>
                            <p className="text-[10px] text-gray-400 mt-1">{new Date(f.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <p className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm mb-4 border border-gray-100">
                        "{f.message}"
                    </p>

                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => sendEmail(f.email)}
                            className="text-blue-600 text-sm font-bold hover:underline px-3 py-2"
                        >
                            Reply via Email ✉️
                        </button>
                        
                        {f.status !== 'Resolved' && (
                            <button 
                                onClick={() => markResolved(f._id)}
                                className="bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-md"
                            >
                                Mark Resolved ✓
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default AdminFeedback;