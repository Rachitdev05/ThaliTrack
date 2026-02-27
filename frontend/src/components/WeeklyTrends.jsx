import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns'; // We might need date formatting, but let's stick to native JS for simplicity

const WeeklyTrends = () => {
  const [range, setRange] = useState(7); // Default: Last 7 Days
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper: Get formatted date string YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Calculate Start and End Date based on 'range'
        const today = new Date();
        const endDate = formatDate(today);
        
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - (range - 1)); // Subtract days
        const startDate = formatDate(pastDate);

        // 2. Call API with range
        const { data } = await axios.get(`/api/foods?startDate=${startDate}&endDate=${endDate}`);

        // 3. Process Data: Group by Date
        // We need to transform list of foods into -> [{date: "Mon", protein: 50, carbs: 100...}, ...]
        const grouped = {};

        // Initialize all days in range with 0 (so empty days show up in chart)
        for (let i = 0; i < range; i++) {
            const d = new Date(pastDate);
            d.setDate(pastDate.getDate() + i);
            const dateKey = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }); // e.g., "Mon 25"
            // We use a simplified key YYYY-MM-DD for matching, display key for chart
            const rawKey = formatDate(d);
            
            grouped[rawKey] = {
                name: dateKey,
                Protein: 0,
                Carbs: 0,
                Fat: 0
            };
        }

        // Fill in actual data
        data.forEach(food => {
            const foodDate = formatDate(new Date(food.createdAt));
            if (grouped[foodDate]) {
                grouped[foodDate].Protein += food.protein;
                grouped[foodDate].Carbs += food.carbs;
                grouped[foodDate].Fat += food.fat;
            }
        });

        // Convert object to array
        setChartData(Object.values(grouped));

      } catch (error) {
        console.error("Error loading trends", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]); // Re-run when range buttons are clicked

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h2 className="text-xl font-bold text-gray-800">📊 Macro Trends</h2>
            <p className="text-xs text-gray-500">Analyze your intake over time</p>
        </div>

        {/* Range Selector Buttons */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
            {[3, 7, 14].map((days) => (
                <button
                    key={days}
                    onClick={() => setRange(days)}
                    className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${
                        range === days 
                        ? 'bg-white text-orange-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Last {days} Days
                </button>
            ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-400">Loading charts...</div>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              {/* Stacked Bars */}
              <Bar dataKey="Carbs" stackId="a" fill="#FBBF24" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Fat" stackId="a" fill="#F87171" />
              <Bar dataKey="Protein" stackId="a" fill="#34D399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default WeeklyTrends;