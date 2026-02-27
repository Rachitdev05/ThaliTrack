import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { indianFoodDB } from '../data/indianFoodDB';

// Added 'defaultCategory' to props
const AddFoodForm = ({ onAdd, defaultCategory }) => {
  const [formData, setFormData] = useState({
    name: '', calories: '', protein: '', carbs: '', fat: '',
    portionSize: '1 katori', approxCost: '', category: 'Breakfast' // Default fallback
  });

  const [suggestions, setSuggestions] = useState([]);

  // NEW: Watch for changes in defaultCategory (e.g., user clicked "Add to Lunch")
  useEffect(() => {
    if (defaultCategory) {
      setFormData(prev => ({ ...prev, category: defaultCategory }));
    }
  }, [defaultCategory]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, name: value });

    if (value.length > 1) {
      const matched = indianFoodDB.filter(food => 
        food.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
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
      category: food.category 
    });
    setSuggestions([]);
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
      // Reset form but keep the category we are working on
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
          
          {/* SEARCHABLE NAME INPUT */}
          <div className="relative">
            <label className="text-xs font-bold text-gray-500">Food Name</label>
            <input 
              type="text" name="name" 
              placeholder="Type 'Roti', 'Dal'..." 
              value={formData.name} onChange={handleNameChange} required
              autoComplete="off"
              className="p-2 border rounded w-full focus:ring-2 focus:ring-green-500 outline-none"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto shadow-lg rounded mt-1">
                {suggestions.map((food, index) => (
                  <li 
                    key={index} 
                    onClick={() => selectFood(food)}
                    className="p-2 hover:bg-green-50 cursor-pointer border-b text-sm"
                  >
                    <span className="font-bold">{food.name}</span> 
                    <span className="text-xs text-gray-500 ml-2">({food.calories} cal)</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
             <label className="text-xs font-bold text-gray-500">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="p-2 border rounded w-full bg-white">
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

           <div>
             <label className="text-xs font-bold text-gray-500">Cost (₹)</label>
             <input type="number" name="approxCost" value={formData.approxCost} onChange={handleChange} className="p-2 border rounded w-full" required />
           </div>
           <div>
             <label className="text-xs font-bold text-gray-500">Portion</label>
             <select name="portionSize" value={formData.portionSize} onChange={handleChange} className="p-2 border rounded w-full bg-white">
                <option value="1 katori">1 Katori</option>
                <option value="1 piece">1 Piece</option>
                <option value="1 plate">1 Plate</option>
                <option value="1 cup">1 Cup</option>
                <option value="1 scoop">1 Scoop</option>
             </select>
           </div>

           {/* Macros Row */}
           <div className="md:col-span-2 grid grid-cols-4 gap-2 bg-gray-50 p-2 rounded">
              <div><label className="text-[10px] text-gray-500">Cals</label><input type="number" name="calories" value={formData.calories} onChange={handleChange} className="w-full p-1 border rounded" /></div>
              <div><label className="text-[10px] text-gray-500">Prot</label><input type="number" name="protein" value={formData.protein} onChange={handleChange} className="w-full p-1 border rounded" /></div>
              <div><label className="text-[10px] text-gray-500">Carbs</label><input type="number" name="carbs" value={formData.carbs} onChange={handleChange} className="w-full p-1 border rounded" /></div>
              <div><label className="text-[10px] text-gray-500">Fat</label><input type="number" name="fat" value={formData.fat} onChange={handleChange} className="w-full p-1 border rounded" /></div>
           </div>

        </div>

        <button type="submit" className="mt-4 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 w-full font-bold">
          + Add to Diary
        </button>
      </form>
    </div>
  );
};

export default AddFoodForm;