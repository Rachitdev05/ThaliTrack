import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const FutureSelf = ({ userSettings }) => {
  // --- 1. SIMULATION STATE ---
  const [duration, setDuration] = useState(30); 
  
  const [inputs, setInputs] = useState({
    // Biometrics
    currentWeight: Number(userSettings?.bodyWeight) || 75,
    height: 175,
    age: 25,
    gender: 'male',
    
    // Activity
    cardioMinutes: 20, 
    workoutIntensity: 'medium',
    dailySteps: 5000,
    
    // Nutrition
    caloriesIn: 2200,
    protein: 120, 
    carbs: 250,
    fats: 70,

    // NEW: Supplements
    creatine: 0, // grams
    preWorkout: false, // boolean
    whey: false // boolean
  });

  const [results, setResults] = useState(null);

  useEffect(() => {
    if(userSettings?.bodyWeight) {
        setInputs(prev => ({...prev, currentWeight: Number(userSettings.bodyWeight)}));
    }
  }, [userSettings]);

  // --- 2. THE BIO-ALGORITHM ---
  useEffect(() => {
    calculateProjection();
  }, [inputs, duration]);

  const calculateProjection = () => {
    // A. Parse Numbers
    const weight = Number(inputs.currentWeight);
    const height = Number(inputs.height);
    const age = Number(inputs.age);
    const calsIn = Number(inputs.caloriesIn);
    const prot = Number(inputs.protein);
    const carbs = Number(inputs.carbs);
    const fats = Number(inputs.fats);

    // B. Calculate Energy OUT (Burn)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += inputs.gender === 'male' ? 5 : -161;

    // TEF
    const tef = (prot * 4 * 0.25) + (carbs * 4 * 0.10) + (fats * 9 * 0.05);

    // Exercise Burn
    const cardioBurn = inputs.cardioMinutes * 8; 
    const stepBurn = inputs.dailySteps * 0.04; 
    
    let gymBurn = 0;
    if (inputs.workoutIntensity === 'low') gymBurn = 150;
    if (inputs.workoutIntensity === 'medium') gymBurn = 350;
    if (inputs.workoutIntensity === 'high') gymBurn = 600;

    // --- SUPPLEMENT IMPACT (Gym Performance) ---
    // Pre-workout increases intensity/burn by ~15% due to caffeine/stimulants
    if (inputs.preWorkout && inputs.workoutIntensity !== 'low') {
        gymBurn = gymBurn * 1.15;
    }

    const totalDailyBurn = bmr + tef + cardioBurn + stepBurn + gymBurn;

    // C. Net Balance
    const dailyDeficit = totalDailyBurn - calsIn;

    // D. Projection
    const totalTissueChange = (dailyDeficit * duration) / 7700; 
    
    // --- SUPPLEMENT IMPACT (Body Water) ---
    // Creatine adds ~1.5% body weight in water retention (Intra-cellular water)
    const creatineWater = inputs.creatine >= 3 ? weight * 0.015 : 0;

    // E. Recomposition Logic
    let muscleChange = 0;
    let fatChange = 0;
    const proteinRatio = (prot * 4) / calsIn; 

    if (dailyDeficit > 0) {
        // WEIGHT LOSS
        if (inputs.workoutIntensity === 'high' && proteinRatio > 0.25) {
            fatChange = totalTissueChange * 0.95; 
            muscleChange = totalTissueChange * 0.05; 
        } else if (inputs.workoutIntensity === 'low') {
            fatChange = totalTissueChange * 0.70; 
            muscleChange = totalTissueChange * 0.30; 
        } else {
            fatChange = totalTissueChange * 0.85;
            muscleChange = totalTissueChange * 0.15;
        }
    } else {
        // WEIGHT GAIN
        const surplus = Math.abs(totalTissueChange);
        if (inputs.workoutIntensity === 'high' && proteinRatio > 0.20) {
            muscleChange = surplus * 0.60; 
            fatChange = surplus * 0.40;
        } else {
            muscleChange = surplus * 0.20;
            fatChange = surplus * 0.80;
        }
    }

    // F. Secondary Metrics & Text
    const finalWeight = weight - totalTissueChange + creatineWater; // Add water weight to scale
    
    // Strength Logic (Creatine Boost)
    let strengthText = "Stable ➡️";
    if (inputs.workoutIntensity === 'high') {
        if (dailyDeficit > 800) strengthText = "Risk of Drop ↘️";
        else strengthText = inputs.creatine >= 3 ? "Explosive Growth 🚀" : "Increasing ↗️";
    }

    // Metabolism Logic
    const metabolismText = dailyDeficit > 1000 ? "Adaptive Slowdown ⚠️" : "High & Healthy 🔥";

    setResults({
        tdee: Math.round(totalDailyBurn),
        net: Math.round(dailyDeficit),
        weightStart: weight,
        weightEnd: finalWeight.toFixed(1),
        fatChange: (fatChange * -1).toFixed(1),
        muscleChange: (dailyDeficit > 0 ? muscleChange * -1 : muscleChange).toFixed(1),
        waterWeight: creatineWater.toFixed(1), // Show user specific water gain
        strength: strengthText,
        metabolism: metabolismText,
        chartData: generateChartData(weight, finalWeight, duration, creatineWater)
    });
  };

  const generateChartData = (start, end, days, water) => {
    const startNum = Number(start);
    const endNum = Number(end);
    const data = [];
    const interval = Math.ceil(days / 6); 
    
    // Water weight loads quickly in first 7 days
    const baseChangePerDay = ((endNum - water) - startNum) / days;

    for (let i = 0; i <= days; i += interval) {
        // Creatine loads in first week
        const currentWater = i > 7 ? water : (water / 7) * i;
        
        data.push({ 
            day: `Day ${i}`, 
            weight: (startNum + (baseChangePerDay * i) + currentWater).toFixed(1) 
        });
    }
    data.push({ day: `Day ${days}`, weight: endNum.toFixed(1) });
    return data;
  };

  if (!results) return <div className="text-white p-4">Initializing AI...</div>;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl text-white border border-gray-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-4 gap-4">
        <div>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                🔮 FutureSelf AI
            </h2>
            <p className="text-xs text-gray-400">Bio-Simulation Engine</p>
        </div>
        
        {/* DURATION */}
        <div className="flex bg-gray-800 p-1 rounded-lg">
            {[15, 30, 45, 60].map(d => (
                <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${duration === d ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    {d} Days
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: INPUTS */}
        <div className="space-y-6 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            {/* 1. ACTIVITY */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">🏃 Activity Level</h3>
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>Daily Cardio</span>
                        <span className="text-blue-300">{inputs.cardioMinutes} min</span>
                    </div>
                    <input type="range" min="0" max="90" step="5" value={inputs.cardioMinutes} onChange={(e) => setInputs({...inputs, cardioMinutes: Number(e.target.value)})} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>Gym Intensity</span>
                        <span className={`uppercase font-bold ${inputs.workoutIntensity === 'high' ? 'text-red-400' : 'text-green-400'}`}>{inputs.workoutIntensity}</span>
                    </div>
                    <select value={inputs.workoutIntensity} onChange={(e) => setInputs({...inputs, workoutIntensity: e.target.value})} className="w-full bg-gray-700 text-sm p-2 rounded border border-gray-600 focus:border-blue-500 outline-none">
                        <option value="low">Low (Light/Yoga)</option>
                        <option value="medium">Medium (Standard)</option>
                        <option value="high">High (Heavy/Crossfit)</option>
                    </select>
                </div>
            </div>

            <div className="border-t border-gray-700"></div>

            {/* 2. SUPPLEMENTS (NEW SECTION) */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">💊 Supplements</h3>
                
                {/* Creatine Slider */}
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>Creatine</span>
                        <span className="text-purple-300">{inputs.creatine}g / day</span>
                    </div>
                    <input 
                        type="range" min="0" max="10" step="1" 
                        value={inputs.creatine} 
                        onChange={(e) => setInputs({...inputs, creatine: Number(e.target.value)})} 
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                        {inputs.creatine >= 3 ? "Effect: High Strength + Water Retention" : "Effect: Minimal"}
                    </p>
                </div>

                {/* Pre-Workout Toggle */}
                <div className="flex items-center justify-between bg-gray-700 p-2 rounded-lg">
                    <span className="text-xs">⚡ Pre-Workout</span>
                    <button 
                        onClick={() => setInputs({...inputs, preWorkout: !inputs.preWorkout})}
                        className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${inputs.preWorkout ? 'bg-orange-500 justify-end' : 'bg-gray-500 justify-start'}`}
                    >
                        <div className="w-3 h-3 bg-white rounded-full shadow-md"></div>
                    </button>
                </div>
            </div>

            <div className="border-t border-gray-700"></div>

            {/* 3. NUTRITION */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider">🥗 Nutrition</h3>
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>Calories In</span>
                        <span className="text-yellow-300">{inputs.caloriesIn} kcal</span>
                    </div>
                    <input type="range" min="1200" max="4000" step="50" value={inputs.caloriesIn} onChange={(e) => setInputs({...inputs, caloriesIn: Number(e.target.value)})} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-500"/>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div><label className="text-[10px] text-gray-400">Prot (g)</label><input type="number" value={inputs.protein} onChange={e => setInputs({...inputs, protein: Number(e.target.value)})} className="w-full bg-gray-700 p-1 rounded text-center text-sm font-bold text-green-400"/></div>
                    <div><label className="text-[10px] text-gray-400">Carb (g)</label><input type="number" value={inputs.carbs} onChange={e => setInputs({...inputs, carbs: Number(e.target.value)})} className="w-full bg-gray-700 p-1 rounded text-center text-sm font-bold text-blue-400"/></div>
                    <div><label className="text-[10px] text-gray-400">Fat (g)</label><input type="number" value={inputs.fats} onChange={e => setInputs({...inputs, fats: Number(e.target.value)})} className="w-full bg-gray-700 p-1 rounded text-center text-sm font-bold text-yellow-400"/></div>
                </div>
            </div>
        </div>

        {/* RIGHT: OUTPUTS */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* PROJECTION CARD */}
            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
                <div>
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Projected Weight ({duration} Days)</p>
                    <h1 className="text-4xl font-extrabold text-white">{results.weightEnd} <span className="text-lg text-purple-400">kg</span></h1>
                    <p className={`text-xs mt-1 ${results.net > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {results.net > 0 ? 'Calorie Deficit' : 'Calorie Surplus'}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-gray-400 text-xs">Tissue Change</p>
                    <p className="text-2xl font-bold text-white">{(results.weightEnd - results.weightStart - results.waterWeight).toFixed(1)} kg</p>
                    {Number(results.waterWeight) > 0 && <p className="text-[10px] text-blue-300">+ {results.waterWeight}kg Water (Creatine)</p>}
                </div>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-3 rounded-xl border-t-2 border-green-500">
                    <p className="text-[10px] uppercase text-gray-400">Fat Mass</p>
                    <p className={`text-lg font-bold ${Number(results.fatChange) < 0 ? 'text-green-400' : 'text-red-400'}`}>{results.fatChange} kg</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-xl border-t-2 border-blue-500">
                    <p className="text-[10px] uppercase text-gray-400">Muscle</p>
                    <p className={`text-lg font-bold ${Number(results.muscleChange) > 0 ? 'text-green-400' : 'text-yellow-400'}`}>{Number(results.muscleChange) > 0 ? '+' : ''}{results.muscleChange} kg</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-xl border-t-2 border-yellow-500">
                    <p className="text-[10px] uppercase text-gray-400">Strength</p>
                    <p className="text-sm font-bold text-white mt-1">{results.strength}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-xl border-t-2 border-red-500">
                    <p className="text-[10px] uppercase text-gray-400">Burn Rate (TDEE)</p>
                    <p className="text-lg font-bold text-white mt-1">{results.tdee} <span className="text-[10px]">cal</span></p>
                </div>
            </div>

            {/* CHART */}
            <div className="h-56 bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Transformation Trajectory</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={results.chartData}>
                        <defs>
                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="day" hide />
                        <YAxis domain={['auto', 'auto']} tick={{fill: '#6b7280', fontSize: 10}} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }} itemStyle={{ color: '#A78BFA' }} />
                        <Area type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

        </div>
      </div>
    </div>
  );
};

export default FutureSelf;