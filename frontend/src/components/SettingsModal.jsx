import React, { useState } from 'react'; // <--- THIS IMPORT WAS MISSING

const SettingsModal = ({ isOpen, onClose, currentSettings, onSave }) => {
  const [tempSettings, setTempSettings] = useState(currentSettings);

  // LOGIC: Auto-calculate protein when weight changes
  const handleWeightChange = (e) => {
    const weight = e.target.value;
    const activityMultiplier = 2; // For muscle building (User requirement)
    
    // Only calculate if weight is a valid number
    const newProteinGoal = weight ? Math.round(weight * activityMultiplier) : 0;
    
    setTempSettings({
        ...tempSettings,
        bodyWeight: weight,
        proteinGoal: newProteinGoal // Auto Update Protein
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">⚙️ Profile & Goals</h2>
        
        <div className="space-y-4">
            {/* 1. Body Weight Input */}
            <div>
            <label className="block text-sm font-bold text-gray-700">Your Weight (kg)</label>
            <input 
              type="number" 
              value={tempSettings.bodyWeight || ''} 
              onChange={handleWeightChange}
              placeholder="e.g. 70"
              className="mt-1 block w-full border border-green-300 rounded-md p-2 bg-green-50 focus:ring-green-500 focus:border-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
                Calculated Protein Goal: <span className="font-bold text-green-700">{tempSettings.proteinGoal || 0}g</span> (2x Weight)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Daily Calorie Goal</label>
            <input 
              type="number" 
              value={tempSettings.calorieGoal} 
              onChange={(e) => setTempSettings({...tempSettings, calorieGoal: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Protein Goal (g)</label>
            <input 
              type="number" 
              value={tempSettings.proteinGoal} 
              onChange={(e) => setTempSettings({...tempSettings, proteinGoal: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Daily Budget (₹)</label>
            <input 
              type="number" 
              value={tempSettings.budgetLimit} 
              onChange={(e) => setTempSettings({...tempSettings, budgetLimit: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onSave(tempSettings);
              onClose();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;