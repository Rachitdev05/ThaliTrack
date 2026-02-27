const FoodCard = ({ food, onDelete }) => {
  return (
    <div className="relative bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-green-500">
      
      {/* Delete Button (Top Right) */}
      <button 
        onClick={() => onDelete(food._id)}
        className="absolute top-2 right-2 text-red-400 hover:text-red-600 font-bold text-xl"
        title="Delete Item"
      >
        &times; {/* This is an HTML entity for 'X' */}
      </button>

      <div className="flex justify-between items-start pr-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{food.name}</h3>
          <p className="text-sm text-gray-500">{food.portionSize}</p>
        </div>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
          {food.category}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
        <div className="bg-gray-50 p-2 rounded">
          <p className="font-bold text-gray-700">{food.calories}</p>
          <p className="text-xs text-gray-400">Kcal</p>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <p className="font-bold text-gray-700">{food.protein}g</p>
          <p className="text-xs text-gray-400">Prot</p>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <p className="font-bold text-gray-700">{food.carbs}g</p>
          <p className="text-xs text-gray-400">Carb</p>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <p className="font-bold text-gray-700">{food.fat}g</p>
          <p className="text-xs text-gray-400">Fat</p>
        </div>
      </div>
      
      <div className="mt-2 text-center">
         <span className="text-xs text-gray-500">Est. Cost: </span>
         <span className="font-bold text-green-700">₹{food.approxCost}</span>
      </div>
    </div>
  );
};

export default FoodCard;