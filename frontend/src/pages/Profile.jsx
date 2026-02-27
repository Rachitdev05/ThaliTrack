import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast'; // Ensure toast is imported if used

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ calorieGoal: 0, weight: 0, budget: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('thaliSettings');
    if (saved) {
        const parsed = JSON.parse(saved);
        setStats({
            calorieGoal: parsed.calorieGoal,
            weight: parsed.bodyWeight,
            budget: parsed.budgetLimit
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* 1. COMPACT HEADER */}
      {/* Added 'z-0' to keep it behind */}
      <div className="bg-white px-6 pt-8 pb-20 shadow-sm relative z-0 border-b border-gray-100">
         <div className="flex justify-between items-center mb-6">
             <button onClick={() => navigate('/')} className="text-gray-600 hover:text-orange-600 font-bold flex items-center gap-1 transition">
                <span>←</span> Back
             </button>
             <div className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                Verified Member
             </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
                <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
         </div>
      </div>

      {/* 2. STATS GRID (Overlapping) */}
      {/* Added 'relative z-10' to force it ON TOP of the header */}
      <div className="max-w-md mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-3 gap-4 border border-gray-100 text-center">
            <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Weight</p>
                <p className="text-xl font-extrabold text-gray-800">{stats.weight || '-'} <span className="text-xs font-normal text-gray-400">kg</span></p>
            </div>
            <div className="border-l border-r border-gray-100">
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Goal</p>
                <p className="text-xl font-extrabold text-gray-800">{stats.calorieGoal || '-'} <span className="text-xs font-normal text-gray-400">cal</span></p>
            </div>
            <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Budget</p>
                <p className="text-xl font-extrabold text-green-600">₹{stats.budget || '-'}</p>
            </div>
        </div>
      </div>

      {/* 3. MENU OPTIONS */}
      <div className="max-w-md mx-auto px-6 mt-6 space-y-3">
        
        {/* Reports Button */}
        <div 
            onClick={() => navigate('/reports')} 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-orange-50 transition group"
        >
            <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition">
                    📊
                </div>
                <div>
                    <h3 className="font-bold text-gray-700">Reports & Analysis</h3>
                    <p className="text-xs text-gray-400">View your weekly progress</p>
                </div>
            </div>
            <span className="text-gray-300 group-hover:text-orange-500">→</span>
        </div>

        {/* Logout Button */}
        <button 
            onClick={logout}
            className="w-full bg-white border border-red-100 p-4 rounded-xl text-red-500 font-bold flex items-center justify-center gap-2 mt-8 hover:bg-red-50 transition shadow-sm"
        >
            Logout
        </button>
      </div>

    </div>
  );
};

export default Profile;