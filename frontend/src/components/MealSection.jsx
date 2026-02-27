import React from 'react';

// Added 'onAddClick' to props
const MealSection = ({ title, foods, onDelete, onAddClick }) => {
  const totalCals = foods.reduce((acc, curr) => acc + Number(curr.calories), 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        <div className="text-sm text-gray-500">
            <span className="font-bold">{totalCals}</span> cals
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100">
        {foods.length === 0 ? (
          <div className="p-4 text-sm text-gray-400 italic text-center">No food logged yet</div>
        ) : (
          foods.map((food) => (
            <div key={food._id} className="p-3 flex justify-between items-center hover:bg-orange-50 transition-colors group">
              <div>
                <p className="font-medium text-gray-800">{food.name}</p>
                <p className="text-xs text-gray-500">{food.portionSize}, {food.protein}g protein</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-700 text-sm">{food.calories}</span>
                <button 
                  onClick={() => onDelete(food._id)}
                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2 font-bold"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer - NOW FUNCTIONAL */}
      <div 
        onClick={onAddClick} // <--- THIS IS THE FIX. When clicked, it calls handleOpenForm('Title')
        className="bg-gray-50 p-3 text-center border-t border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
      >
         <span className="text-xs text-orange-600 font-bold uppercase tracking-wide">
            + Add Food to {title}
         </span>
      </div>
    </div>
  );
};

export default MealSection;