import React from 'react';

const Dashboard = ({ foods, goals }) => {
  // 1. Calculate Totals
  const totalCalories = foods.reduce((acc, curr) => acc + Number(curr.calories), 0);
  const totalProtein = foods.reduce((acc, curr) => acc + Number(curr.protein), 0);
  const totalCost = foods.reduce((acc, curr) => acc + Number(curr.approxCost), 0);

  // 2. Dynamic Logic (Get goals from settings)
  const calorieGoal = Number(goals?.calorieGoal || 2000);
  const budgetLimit = Number(goals?.budgetLimit || 500);
  
  // *** THIS WAS MISSING ***
  const proteinGoal = Number(goals?.proteinGoal || 60); 

  // 3. Status Checks
  const isOverCalories = totalCalories > calorieGoal;
  const isOverBudget = totalCost > budgetLimit;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
      
      {/* Calories Card */}
      <div className={`p-4 rounded-lg shadow-md border-l-4 ${isOverCalories ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'} transition-all`}>
        <h3 className="text-gray-500 text-sm font-bold uppercase">Total Calories</h3>
        <p className={`text-3xl font-extrabold ${isOverCalories ? 'text-red-600' : 'text-gray-800'}`}>
          {totalCalories} <span className="text-sm font-normal text-gray-500">/ {calorieGoal}</span>
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div className={`h-2.5 rounded-full ${isOverCalories ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((totalCalories/calorieGoal)*100, 100)}%` }}></div>
        </div>
      </div>

      {/* Protein Card */}
      <div className="bg-green-50 p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 className="text-green-800 text-sm font-bold uppercase">Total Protein</h3>
        <p className="text-3xl font-extrabold text-green-900">
            {totalProtein}g <span className="text-sm font-normal text-gray-500">/ {proteinGoal}g</span>
        </p>
        <p className="text-xs text-green-600 mt-1">Muscle Fuel 💪</p>
      </div>

      {/* Cost Card */}
      <div className={`p-4 rounded-lg shadow-md border-l-4 ${isOverBudget ? 'bg-red-50 border-red-500' : 'bg-orange-50 border-orange-500'} transition-all`}>
        <h3 className="text-orange-800 text-sm font-bold uppercase">Daily Cost</h3>
        <p className={`text-3xl font-extrabold ${isOverBudget ? 'text-red-600' : 'text-orange-900'}`}>
          ₹{totalCost} <span className="text-sm font-normal text-gray-500">/ ₹{budgetLimit}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {isOverBudget ? '⚠️ Budget Exceeded!' : '✅ Within Budget'}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;