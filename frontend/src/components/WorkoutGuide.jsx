import React, { useState, useEffect } from 'react';
import { workoutPlans } from '../data/workoutPlans';
import toast from 'react-hot-toast';

const WorkoutGuide = () => {
  const [mode, setMode] = useState('home'); // 'home' or 'gym'
  const [showModal, setShowModal] = useState(false);
  
  // Custom Workouts State
  const [customWorkouts, setCustomWorkouts] = useState(() => {
    const saved = localStorage.getItem('myCustomWorkouts');
    return saved ? JSON.parse(saved) : { home: [], gym: [] };
  });

  // --- FORM STATE ---
  const [dayName, setDayName] = useState(''); // "Leg Day"
  const [currentExercise, setCurrentExercise] = useState(''); // "Squats"
  const [currentSets, setCurrentSets] = useState(''); // "3x10"
  
  // This holds the list of exercises currently being built inside the modal
  const [tempExerciseList, setTempExerciseList] = useState([]); 

  // Save to LocalStorage whenever customWorkouts change
  useEffect(() => {
    localStorage.setItem('myCustomWorkouts', JSON.stringify(customWorkouts));
  }, [customWorkouts]);

  // 1. Add exercise to the temporary list inside the modal
  const handleAddToTempList = (e) => {
    e.preventDefault();
    if (!currentExercise || !currentSets) {
        toast.error("Please enter exercise name and sets");
        return;
    }
    const exerciseString = `${currentExercise} (${currentSets})`;
    setTempExerciseList([...tempExerciseList, exerciseString]);
    
    // Clear inputs for next exercise
    setCurrentExercise('');
    setCurrentSets('');
  };

  // 2. Save the whole card to the dashboard
  const handleSaveFullWorkout = () => {
    if (!dayName) {
        toast.error("Please name your workout day (e.g. Leg Day)");
        return;
    }
    if (tempExerciseList.length === 0) {
        toast.error("Please add at least one exercise");
        return;
    }

    // Create the full card object
    const newWorkoutCard = {
        id: Date.now(),
        day: dayName,
        exercises: tempExerciseList
    };

    setCustomWorkouts(prev => ({
        ...prev,
        [mode]: [...prev[mode], newWorkoutCard]
    }));

    toast.success("Workout Routine Created! 💪");
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setDayName('');
    setCurrentExercise('');
    setCurrentSets('');
    setTempExerciseList([]);
  };

  const deleteCustomDay = (dayIndex) => {
    if(window.confirm("Delete this custom workout plan?")) {
        setCustomWorkouts(prev => {
            const updatedList = prev[mode].filter((_, index) => index !== dayIndex);
            return { ...prev, [mode]: updatedList };
        });
        toast.success("Deleted.");
    }
  };

  const displayPlans = [...workoutPlans[mode], ...(customWorkouts[mode] || [])];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6 animate-fade-in">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">💪 Workout Plan</h2>
                <p className="text-sm text-gray-500">Select your environment</p>
            </div>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
                <button onClick={() => setMode('home')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'home' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Home 🏠</button>
                <button onClick={() => setMode('gym')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'gym' ? 'bg-purple-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Gym 🏋️</button>
            </div>
        </div>

        {/* Workout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPlans.map((plan, index) => {
                const isCustom = plan.id !== undefined; 

                return (
                    <div key={index} className={`relative border-l-4 ${mode === 'home' ? 'border-blue-500 bg-blue-50' : 'border-purple-500 bg-purple-50'} p-5 rounded-r-lg shadow-sm hover:shadow-md transition-shadow`}>
                        
                        {isCustom && (
                            <button 
                                onClick={() => deleteCustomDay(index - workoutPlans[mode].length)}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-600 font-bold"
                                title="Delete Plan"
                            >
                                ✕
                            </button>
                        )}

                        <h3 className="font-bold text-lg text-gray-800 mb-3 border-b pb-2 border-gray-200">
                            {plan.day} {isCustom && <span className="text-[10px] bg-yellow-200 text-yellow-800 px-1 rounded ml-2">CUSTOM</span>}
                        </h3>
                        
                        <ul className="space-y-3">
                            {plan.exercises.map((ex, idx) => (
                                <li key={idx} className="flex items-start text-gray-700 text-sm">
                                    <span className={`mt-1.5 w-2 h-2 ${mode === 'home' ? 'bg-blue-500' : 'bg-purple-500'} rounded-full mr-2 shrink-0`}></span>
                                    <span>{ex}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
            
            {/* Add Custom Workout Card */}
            <button 
                onClick={() => setShowModal(true)}
                className="border-2 border-dashed border-gray-300 p-4 rounded-lg flex flex-col justify-center items-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-blue-400 hover:text-blue-500 transition h-full min-h-[200px]"
            >
                <span className="text-4xl mb-2">+</span>
                <p className="font-bold">Create New Routine</p>
                <span className="text-xs">Add multiple exercises</span>
            </button>
        </div>

        {/* MODAL POPUP (The Builder) */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                    <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Build Your Routine</h3>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 font-bold text-xl">✕</button>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        {/* 1. Name the Routine */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Routine Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Leg Day Destroyer" 
                                value={dayName}
                                onChange={(e) => setDayName(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* 2. Add Exercises Section */}
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">Add Exercises</h4>
                            <div className="flex gap-2 mb-2">
                                <input 
                                    type="text" 
                                    placeholder="Exercise (e.g. Squat)" 
                                    value={currentExercise}
                                    onChange={(e) => setCurrentExercise(e.target.value)}
                                    className="w-2/3 border border-gray-300 rounded p-1 text-sm"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Sets (3x12)" 
                                    value={currentSets}
                                    onChange={(e) => setCurrentSets(e.target.value)}
                                    className="w-1/3 border border-gray-300 rounded p-1 text-sm"
                                />
                            </div>
                            <button 
                                onClick={handleAddToTempList}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 rounded"
                            >
                                + Add to List
                            </button>
                        </div>

                        {/* 3. The Preview List */}
                        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
                            {tempExerciseList.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center italic">No exercises added yet.</p>
                            ) : (
                                <ul className="space-y-1">
                                    {tempExerciseList.map((item, idx) => (
                                        <li key={idx} className="text-sm flex justify-between bg-white p-1 rounded border border-gray-100">
                                            <span>{idx + 1}. {item}</span>
                                            <button 
                                                onClick={() => setTempExerciseList(tempExerciseList.filter((_, i) => i !== idx))}
                                                className="text-red-400 hover:text-red-600 font-bold px-1"
                                            >
                                                ✕
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* 4. Save Button */}
                        <button 
                            onClick={handleSaveFullWorkout} 
                            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-md mt-2"
                        >
                            Save Routine
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default WorkoutGuide;