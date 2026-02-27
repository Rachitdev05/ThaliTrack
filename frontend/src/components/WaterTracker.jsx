import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WaterTracker = ({ date }) => {
  // --- STATE ---
  const [currentIntake, setCurrentIntake] = useState(0);
  const [dailyTarget, setDailyTarget] = useState(3000); // Default 3000ml
  const [selectedCupSize, setSelectedCupSize] = useState(250); // Default 250ml
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  
  // Available Cup Sizes
  const cupOptions = [
    { size: 100, label: "Small" },
    { size: 250, label: "Glass" },
    { size: 500, label: "Bottle" },
    { size: 750, label: "Large" }
  ];

  // --- EFFECT: Load/Save Data ---
  useEffect(() => {
    // Load Water Data
    const savedWater = localStorage.getItem(`water-${date}`);
    if (savedWater) setCurrentIntake(Number(savedWater));
    else setCurrentIntake(0);

    // Load User Target (Global setting, not per day)
    const savedTarget = localStorage.getItem('waterTarget');
    if (savedTarget) setDailyTarget(Number(savedTarget));
  }, [date]);

  const saveIntake = (newAmount) => {
    setCurrentIntake(newAmount);
    localStorage.setItem(`water-${date}`, newAmount);
  };

  const updateTarget = (newTarget) => {
    setDailyTarget(newTarget);
    localStorage.setItem('waterTarget', newTarget);
    setIsEditingTarget(false);
    toast.success(`Target set to ${newTarget}ml`);
  };

  // --- HANDLERS ---
  const addWater = () => {
    const newAmount = currentIntake + selectedCupSize;
    saveIntake(newAmount);
    if (newAmount >= dailyTarget && currentIntake < dailyTarget) {
        toast.success("🎉 Hydration Goal Reached!");
    }
  };

  const removeWater = () => {
    const newAmount = Math.max(0, currentIntake - selectedCupSize);
    saveIntake(newAmount);
  };

  // Calculate Percentage for Animation (Max 100%)
  const percentage = Math.min((currentIntake / dailyTarget) * 100, 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 mb-6 relative overflow-hidden">
      
      {/* 1. HEADER */}
      <div className="text-center mb-6">
        <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-1">Water Tracker</h3>
        <h1 className="text-4xl font-extrabold text-[#00548F]">
            {currentIntake}<span className="text-lg text-gray-400 font-medium">ml</span>
        </h1>
        
        {/* Editable Target */}
        <div className="flex justify-center items-center gap-2 mt-1">
            {isEditingTarget ? (
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        defaultValue={dailyTarget}
                        onBlur={(e) => updateTarget(Number(e.target.value))}
                        autoFocus
                        className="w-20 border border-blue-300 rounded px-1 text-center font-bold text-gray-700"
                    />
                    <span className="text-xs text-blue-500 cursor-pointer" onClick={() => setIsEditingTarget(false)}>Save</span>
                </div>
            ) : (
                <p className="text-gray-500 font-medium text-sm flex items-center gap-1">
                    Target: {dailyTarget} ml
                    <button onClick={() => setIsEditingTarget(true)} className="text-blue-400 hover:text-blue-600">
                        {/* Pencil Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </button>
                </p>
            )}
        </div>
      </div>

      {/* 2. THE BIG VISUAL CIRCLE */}
      <div className="flex justify-center mb-8 relative">
        {/* Container Circle */}
        <div className="w-64 h-64 rounded-full border-4 border-blue-100 relative overflow-hidden bg-blue-50 shadow-inner">
            
            {/* The Water (Filling Animation) */}
            <div 
                className="absolute bottom-0 left-0 w-full bg-blue-400 transition-all duration-1000 ease-in-out opacity-80"
                style={{ height: `${percentage}%` }}
            >
                {/* Wave Effect (CSS Trick) */}
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-300 opacity-50 blur-sm transform -translate-y-1"></div>
            </div>

            {/* Percentage Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className={`text-4xl font-bold ${percentage > 50 ? 'text-white' : 'text-blue-500'}`}>
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
      </div>

      {/* 3. CONTROL BUTTONS (+ / -) */}
      <div className="flex justify-center items-center gap-6 mb-8">
        {/* Remove Button */}
        <button 
            onClick={removeWater}
            className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 font-bold text-2xl flex items-center justify-center hover:bg-blue-100 transition shadow-sm"
        >
            -
        </button>

        {/* Add Button (Big) */}
        <button 
            onClick={addWater}
            className="px-8 py-3 rounded-full bg-blue-500 text-white font-bold text-xl shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform flex items-center gap-2"
        >
            <span>+ {selectedCupSize} ml</span>
        </button>
      </div>

      {/* 4. CUP CAPACITY SELECTOR */}
      <div>
        <h4 className="font-bold text-gray-700 mb-3 text-sm">Cup Capacity</h4>
        <div className="grid grid-cols-4 gap-2">
            {cupOptions.map((cup) => (
                <button
                    key={cup.size}
                    onClick={() => setSelectedCupSize(cup.size)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                        selectedCupSize === cup.size 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md ring-2 ring-blue-200' 
                        : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    {/* Dynamic Cup Icon Size */}
                    <div className="mb-1">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width={20 + (cup.size / 50)} // Icon grows with size
                            height={20 + (cup.size / 50)} 
                            viewBox="0 0 24 24" fill="currentColor" 
                            className={selectedCupSize === cup.size ? 'text-blue-500' : 'text-gray-300'}
                        >
                            <path d="M18.3 5.71a.9959.9959 0 0 0-1.41 0L12 10.59 7.11 5.7a.9959.9959 0 0 0-1.41 1.41L12 13.41l6.29-6.29a.9959.9959 0 0 0 0-1.41z" opacity="0"/>
                            <path d="M5 2h14a1 1 0 0 1 1 1v7c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V3a1 1 0 0 1 1-1zm2 5h10V4H7v3zm0 4h10V9H7v2z"/> 
                            {/* Simple Cup Shape */}
                            <path d="M4 2L4.5 19C4.5 20.6569 5.84315 22 7.5 22H16.5C18.1569 22 19.5 20.6569 19.5 19L20 2H4Z" fillOpacity="0.2"/>
                        </svg>
                    </div>
                    <span className="font-bold text-sm">{cup.size}</span>
                    <span className="text-[10px] uppercase">{cup.label}</span>
                </button>
            ))}
        </div>
      </div>

    </div>
  );
};

export default WaterTracker;