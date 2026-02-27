import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MacroChart = ({ foods }) => {
  // 1. Calculate Totals
  const totalCarbs = foods.reduce((acc, curr) => acc + Number(curr.carbs), 0);
  const totalProtein = foods.reduce((acc, curr) => acc + Number(curr.protein), 0);
  const totalFat = foods.reduce((acc, curr) => acc + Number(curr.fat), 0);

  // 2. Prepare Data for Recharts
  // If no food, show empty data so the chart doesn't crash
  const data = [
    { name: 'Carbs', value: totalCarbs },
    { name: 'Protein', value: totalProtein },
    { name: 'Fat', value: totalFat },
  ];

  // 3. Define Colors (Carbs=Yellow, Protein=Green, Fat=Red)
  const COLORS = ['#FFBB28', '#00C49F', '#FF8042'];

  // If no food, don't show an empty ugly chart
  if (foods.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
      <h3 className="text-gray-600 font-bold mb-4">🍽️ Macro Balance</h3>
      
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%" // Center X
              cy="50%" // Center Y
              innerRadius={60} // Makes it a Donut Chart (Modern look)
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-xs text-gray-400 mt-2 text-center">
        Tip: A balanced Indian diet should be<br/>
        50% Carbs, 20% Protein, 30% Fat.
      </div>
    </div>
  );
};

export default MacroChart;