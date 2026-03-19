import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { indianFoodDB } from '../data/indianFoodDB';

const AddFoodForm = ({ onAdd, defaultCategory }) => {
  const[formData, setFormData] = useState({
    name: '', calories: '', protein: '', carbs: '', fat: '',
    portionSize: '1 katori', approxCost: '', category: 'Breakfast'
  });

  const[suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (defaultCategory) {
      setFormData(prev => ({ ...prev, category: defaultCategory }));
    }
  }, [defaultCategory]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, name: value });
    setShowSuggestions(true);

    if (value.trim() === '') {
      setSuggestions(indianFoodDB);
    } else {
      const matched = indianFoodDB.filter(food => 
        food.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matched);
    }
  };

  const openDropdown = () => {
    if (!formData.name) {
         setSuggestions(indianFoodDB); 
    }
    setShowSuggestions(true);
  };

  const closeDropdown = () => {
    // Hide suggestions when clicking outside
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const selectFood = (food) => {
    setFormData({
      ...formData,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      portionSize: food.portionSize,
      approxCost: food.approxCost,
      category: formData.category 
    });
    setShowSuggestions(false); // Instantly close dropdown
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/foods', formData);
      onAdd(data);
      toast.success("Meal added! 🍛");
      setFormData({
        name: '', calories: '', protein: '', carbs: '', fat: '',
        portionSize: '1 katori', approxCost: '', category: defaultCategory || 'Breakfast'
      });
      setSuggestions([]);
    } catch (error) {
      toast.error("Error adding food.");
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="relative">
            <label className="text-xs font-bold text-gray-500">Food Name</label>
            <div className="relative">
                <input 
                  type="text" name="name" 
                  placeholder="Select or type food..." 
                  value={formData.name} 
                  onChange={handleNameChange} 
                  onFocus={openDropdown}
                  onBlur={closeDropdown}
                  required
                  autoComplete="off"
                  className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-orange-500 outline-none pr-10 shadow-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                   ▼
                </div>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-50 bg-white border border-gray-200 w-full max-h-56 overflow-y-auto shadow-2xl rounded-lg mt-1">
                {suggestions.map((food, index) => (
                  <li 
                    key={index} 
                    // 👇 THIS IS THE CRITICAL FIX 👇
                    // We use onMouseDown instead of onClick, and preventDefault to stop the input from blurring
                    onMouseDown={(e) => {
                        e.preventDefault();
                        selectFood(food);
                    }}
                    className="p-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 flex justify-between items-center transition-colors"
                  >
                    <div>
                        <span className="font-bold text-gray-700 block">{food.name}</span>
                        <span className="text-[10px] text-gray-400">{food.portionSize}</span>
                    </div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-md">
                        {food.calories} cal
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
             <label className="text-xs font-bold text-gray-500">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg w-full bg-white shadow-sm outline-none focus:ring-2 focus:ring-orange-500">
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

           <div>
             <label className="text-xs font-bold text-gray-500">Cost (₹)</label>
             <input type="number" name="approxCost" value={formData.approxCost} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg w-full shadow-sm outline-none focus:ring-2 focus:ring-orange-500" required />
           </div>
           
           <div>
             <label className="text-xs font-bold text-gray-500">Portion</label>
             <select name="portionSize" value={formData.portionSize} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg w-full bg-white shadow-sm outline-none focus:ring-2 focus:ring-orange-500">
                <option value="1 katori">1 Katori</option>
                <option value="1 piece">1 Piece</option>
                <option value="1 plate">1 Plate</option>
                <option value="1 cup">1 Cup</option>
                <option value="1 scoop">1 Scoop</option>
             </select>
           </div>

           {/* Macros Row */}
           <div className="md:col-span-2 grid grid-cols-4 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div><label className="text-[10px] font-bold text-gray-400 uppercase">Cals</label><input type="number" name="calories" value={formData.calories} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md outline-none focus:border-orange-500" /></div>
              <div><label className="text-[10px] font-bold text-gray-400 uppercase">Prot(g)</label><input type="number" name="protein" value={formData.protein} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md outline-none focus:border-green-500" /></div>
              <div><label className="text-[10px] font-bold text-gray-400 uppercase">Carb(g)</label><input type="number" name="carbs" value={formData.carbs} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md outline-none focus:border-blue-500" /></div>
              <div><label className="text-[10px] font-bold text-gray-400 uppercase">Fat(g)</label><input type="number" name="fat" value={formData.fat} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md outline-none focus:border-yellow-500" /></div>
           </div>

        </div>

        <button type="submit" className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:shadow-lg w-full font-bold transition-all transform hover:-translate-y-1">
          + Add to Diary
        </button>
      </form>
    </div>
  );
};

export default AddFoodForm;