import React from 'react';

const DiaryView = ({ foods, onDelete }) => {
  // 1. Group foods by Category
  const sections = {
    Breakfast: foods.filter(f => f.category === 'Breakfast'),
    Lunch: foods.filter(f => f.category === 'Lunch'),
    Dinner: foods.filter(f => f.category === 'Dinner'),
    Snack: foods.filter(f => f.category === 'Snack'),
  };

  const categories = ["Breakfast", "Lunch", "Dinner", "Snack"];

  return (
    <div className="space-y-6">
      {categories.map((cat) => {
        const categoryFoods = sections[cat];
        // Calculate Totals for this specific meal
        const mealCals = categoryFoods.reduce((acc, curr) => acc + Number(curr.calories), 0);
        const mealProt = categoryFoods.reduce((acc, curr) => acc + Number(curr.protein), 0);

        return (
          <div key={cat} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header: Meal Name + Totals */}
            <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">{cat}</h3>
              <div className="text-sm text-gray-500">
                <span className="font-bold text-gray-700">{mealCals}</span> kcal • 
                <span className="font-bold text-green-600 ml-1">{mealProt}g</span> P
              </div>
            </div>

            {/* List of Foods */}
            <div className="divide-y divide-gray-100">
              {categoryFoods.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-400 italic">
                  No food logged for {cat} yet.
                </div>
              ) : (
                categoryFoods.map((food) => (
                  <div key={food._id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                    <div>
                      <p className="font-medium text-gray-800">{food.name}</p>
                      <p className="text-xs text-gray-500">
                        {food.portionSize} • ₹{food.approxCost}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right text-xs md:text-sm">
                        <p>{food.calories} kcal</p>
                        <p className="text-green-600">{food.protein}g Prot</p>
                      </div>
                      
                      {/* Delete Button (Small X) */}
                      <button 
                        onClick={() => onDelete(food._id)}
                        className="text-gray-300 hover:text-red-500 font-bold px-2"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DiaryView;