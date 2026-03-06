import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Feedback = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    type: 'Suggestion',
    message: ''
  });

  // History State
  const [history, setHistory] = useState([]);

  // Fetch History when tab changes
  useEffect(() => {
    if (activeTab === 'history') {
        fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
        const { data } = await axios.get('/api/feedback/my');
        setHistory(data);
    } catch (error) {
        console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.message.trim()) return toast.error("Please enter a message");

    setLoading(true);
    try {
        await axios.post('/api/feedback', formData);
        toast.success("Feedback sent! We appreciate it. 💌");
        setFormData({ type: 'Suggestion', message: '' }); // Reset form
        setActiveTab('history'); // Switch to history view to show it's saved
    } catch (error) {
        toast.error("Failed to send feedback.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate('/profile')} className="bg-white p-2 rounded-full shadow-sm text-gray-600 hover:text-orange-600">
                ←
            </button>
            <h1 className="text-2xl font-extrabold text-gray-800">Feedback & Support 💬</h1>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl shadow-sm p-1 mb-6">
            <button 
                onClick={() => setActiveTab('new')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'new' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                Submit New
            </button>
            <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                My History
            </button>
        </div>

        {/* --- VIEW: NEW FEEDBACK --- */}
        {activeTab === 'new' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* User Info (Read Only) */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">From</label>
                        <input type="text" value={user?.email} disabled className="w-full mt-1 p-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed" />
                    </div>

                    {/* Type Selector */}
                    <div>
                        <label className="text-xs font-bold text-gray-600 uppercase">Feedback Type</label>
                        <select 
                            value={formData.type} 
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="w-full mt-1 p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                            <option value="Suggestion">💡 Suggestion</option>
                            <option value="Bug">🐛 Bug Report</option>
                            <option value="Feature Request">✨ Feature Request</option>
                            <option value="Complaint">😡 Complaint</option>
                            <option value="Other">📝 Other</option>
                        </select>
                    </div>

                    {/* Message Area */}
                    <div>
                        <label className="text-xs font-bold text-gray-600 uppercase">Message</label>
                        <textarea 
                            rows="5"
                            placeholder="Tell us what's on your mind..."
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            className="w-full mt-1 p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Feedback 🚀'}
                    </button>
                </form>
            </div>
        )}

        {/* --- VIEW: HISTORY --- */}
        {activeTab === 'history' && (
            <div className="space-y-4">
                {history.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">No feedback submitted yet.</div>
                ) : (
                    history.map((item) => (
                        <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold 
                                    ${item.type === 'Bug' ? 'bg-red-100 text-red-600' : 
                                      item.type === 'Suggestion' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {item.type}
                                </span>
                                <span className={`text-xs font-bold ${item.status === 'Resolved' ? 'text-green-600' : 'text-orange-500'}`}>
                                    {item.status}
                                </span>
                            </div>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{item.message}</p>
                            <p className="text-[10px] text-gray-400 mt-3 text-right">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                )}
            </div>
        )}

      </div>
    </div>
  );
};

export default Feedback;