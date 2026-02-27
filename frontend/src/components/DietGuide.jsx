import React, { useState } from 'react';
import { dietPlans } from '../data/mealPlans';

const DietGuide = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null); // NEW: Track specific meal click

  // 1. GALLERY VIEW (The Cards)
  if (!selectedPlan) {
    return (
      <div className="animate-fade-in max-w-6xl mx-auto">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6">🔥 Trending Diet Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dietPlans.map((plan) => (
            <div 
              key={plan.id} 
              onClick={() => setSelectedPlan(plan)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100 group"
            >
              {/* IMAGE HEADER */}
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={plan.coverImage} 
                  alt={plan.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm
                  ${plan.color === 'green' ? 'bg-green-500' : plan.color === 'red' ? 'bg-red-500' : 'bg-blue-500'}`}
                >
                  {plan.tag}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {plan.subtitle}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                  <span>📅 {plan.duration}</span>
                  <span>•</span>
                  <span>View Plan →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. MEAL DETAIL VIEW (The Nutrition Label) <-- NEW SECTION
  if (selectedMeal) {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Image */}
        <div className="relative h-64">
             <img src={selectedMeal.image} className="w-full h-full object-cover" />
             <button 
                onClick={() => setSelectedMeal(null)}
                className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white text-gray-800 font-bold"
             >
                ✕ Close
             </button>
        </div>

        <div className="p-6 md:p-8">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">{selectedMeal.name}</h2>
            <p className="text-gray-500 mb-6">{selectedMeal.description}</p>

            {/* INGREDIENTS */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">🥗 Ingredients</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedMeal.ingredients?.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700 font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            {ing}
                        </li>
                    )) || <p>Ingredients not listed</p>}
                </ul>
            </div>

            {/* NUTRITION GRID */}
            <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">⚡ Nutrition Facts</h3>
                
                {/* Big Macros */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-orange-50 p-3 rounded-xl text-center border border-orange-100">
                        <div className="text-2xl font-extrabold text-orange-600">{selectedMeal.nutrition?.calories}</div>
                        <div className="text-xs font-bold text-orange-400 uppercase">Cals</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl text-center border border-green-100">
                        <div className="text-2xl font-extrabold text-green-600">{selectedMeal.nutrition?.protein}g</div>
                        <div className="text-xs font-bold text-green-400 uppercase">Prot</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl text-center border border-blue-100">
                        <div className="text-2xl font-extrabold text-blue-600">{selectedMeal.nutrition?.carbs}g</div>
                        <div className="text-xs font-bold text-blue-400 uppercase">Carb</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-xl text-center border border-yellow-100">
                        <div className="text-2xl font-extrabold text-yellow-600">{selectedMeal.nutrition?.fat}g</div>
                        <div className="text-xs font-bold text-yellow-400 uppercase">Fat</div>
                    </div>
                </div>

                {/* Micros Details */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Fiber</span>
                            <span className="font-bold text-gray-800">{selectedMeal.nutrition?.fiber || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Sugar</span>
                            <span className="font-bold text-gray-800">{selectedMeal.nutrition?.sugar || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Calcium</span>
                            <span className="font-bold text-gray-800">{selectedMeal.nutrition?.calcium || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Iron</span>
                            <span className="font-bold text-gray-800">{selectedMeal.nutrition?.iron || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Magnesium</span>
                            <span className="font-bold text-gray-800">{selectedMeal.nutrition?.magnesium || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    );
  }

  // 3. MEAL LIST VIEW (Layer 2)
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-slide-up max-w-4xl mx-auto">
      
      {/* HERO SECTION */}
      <div className="relative h-48 md:h-64">
        <img src={selectedPlan.coverImage} className="w-full h-full object-cover brightness-75" />
        
        {/* Back Button */}
        <button 
          onClick={() => setSelectedPlan(null)}
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-white/30 border border-white/40 shadow-lg flex items-center gap-2 transition"
        >
          ← Back
        </button>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <span className={`px-2 py-1 rounded text-xs font-bold mb-2 inline-block ${selectedPlan.color === 'green' ? 'bg-green-500' : 'bg-red-500'}`}>
            {selectedPlan.tag}
          </span>
          <h2 className="text-3xl font-extrabold">{selectedPlan.title}</h2>
          <p className="text-gray-200 text-sm opacity-90">{selectedPlan.subtitle}</p>
        </div>
      </div>

      {/* MEAL LIST WITH IMAGES */}
      <div className="p-6 space-y-8">
        {selectedPlan.categories.map((category, index) => (
            <div key={index}>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                    {category.title}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((meal, idx) => (
                        // ADDED onClick TO OPEN MEAL DETAIL
                        <div 
                            key={idx} 
                            onClick={() => setSelectedMeal(meal)} 
                            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex overflow-hidden group cursor-pointer"
                        >
                            <div className="w-24 h-24 shrink-0 overflow-hidden">
                                <img 
                                    src={meal.image} 
                                    alt={meal.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-3 flex flex-col justify-center flex-grow">
                                <h4 className="font-bold text-gray-700 text-sm leading-tight mb-1 group-hover:text-orange-600 transition-colors">
                                    {meal.name}
                                </h4>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className="font-semibold text-orange-500">{meal.nutrition?.calories || meal.cals} kcal</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="font-semibold text-green-600">{meal.nutrition?.protein || meal.protein}g Protein</span>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-2">Tap for full nutrition →</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default DietGuide;