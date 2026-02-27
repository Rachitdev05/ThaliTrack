import React from 'react';

const SummaryHeader = ({ foods, goals }) => {
  const totalCalories = foods.reduce((acc, curr) => acc + Number(curr.calories), 0);
  const calorieGoal = Number(goals?.calorieGoal || 2000);
  const remaining = calorieGoal - totalCalories;

  // Simple Gamification: If user has logged food, show Fire!
  const hasLoggedToday = foods.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 relative overflow-hidden">
      
      {/* HEADER ROW */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-gray-700 font-bold text-lg">Calories Remaining</h2>
        
        {/* STREAK BADGE */}
        {hasLoggedToday && (
            <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                <span>🔥</span>
                <span>Day Streak Active</span>
            </div>
        )}
      </div>
      
      {/* MATH ROW */}
      <div className="flex justify-between items-center text-center">
        {/* GOAL */}
        <div>
          <p className="text-gray-400 text-xs uppercase font-bold tracking-wide">Goal</p>
          <p className="text-xl md:text-2xl font-extrabold text-gray-800">{calorieGoal}</p>
        </div>

        <div className="text-gray-300 text-xl font-light">-</div>

        {/* FOOD */}
        <div>
          <p className="text-gray-400 text-xs uppercase font-bold tracking-wide">Food</p>
          <p className="text-xl md:text-2xl font-extrabold text-blue-600">{totalCalories}</p>
        </div>

        <div className="text-gray-300 text-xl font-light">=</div>

        {/* REMAINING */}
        <div>
          <p className="text-gray-400 text-xs uppercase font-bold tracking-wide">Remaining</p>
          <p className={`text-2xl md:text-3xl font-extrabold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
            {remaining}
          </p>
        </div>
      </div>

      {/* PROGRESS BAR (Visual) */}
      <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${remaining < 0 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%` }}
          ></div>
      </div>
    </div>
  );
};

export default SummaryHeader;