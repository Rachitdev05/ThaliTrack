import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WeeklyTrends from '../components/WeeklyTrends';
import MacroChart from '../components/MacroChart';

const Reports = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch last 30 days of data for analysis
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // Go back 30 days
        const startDateString = startDate.toISOString().split('T')[0];

        const { data } = await axios.get(`/api/foods?startDate=${startDateString}&endDate=${endDate}`);
        setFoods(data);
      } catch (error) {
        console.error("Error fetching report data");
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/profile')} className="bg-white p-2 rounded-full shadow-sm text-gray-600 hover:text-orange-600">
                ←
            </button>
            <h1 className="text-2xl font-extrabold text-gray-800">Your Reports 📈</h1>
        </div>

        {loading ? (
            <p className="text-center text-gray-400 mt-20">Gathering your data...</p>
        ) : (
            <div className="space-y-8">
                {/* 1. Weekly Trends (Reused Component) */}
                <section>
                    <h2 className="text-lg font-bold text-gray-700 mb-3 ml-2">Weekly Consistency</h2>
                    <WeeklyTrends />
                </section>

                {/* 2. Overall Macro Split */}
                <section>
                    <h2 className="text-lg font-bold text-gray-700 mb-3 ml-2">Total Nutrition Split (Last 30 Days)</h2>
                    <MacroChart foods={foods} />
                </section>

                {/* 3. Text Summary */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4">Quick Insights</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-orange-50 p-4 rounded-lg">
                            <p className="text-xs text-orange-500 font-bold uppercase">Total Meals</p>
                            <p className="text-3xl font-extrabold text-gray-800">{foods.length}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-xs text-green-600 font-bold uppercase">Avg Protein</p>
                            <p className="text-3xl font-extrabold text-gray-800">
                                {foods.length > 0 ? Math.round(foods.reduce((acc, curr) => acc + curr.protein, 0) / foods.length) : 0}g
                            </p>
                            <p className="text-[10px] text-gray-400">per meal</p>
                        </div>
                    </div>
                </section>
            </div>
        )}
      </div>
    </div>
  );
};

export default Reports;