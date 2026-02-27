import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// COMPONENTS
import AddFoodForm from "../components/AddFoodForm";
import SettingsModal from "../components/SettingsModal";
import DietGuide from "../components/DietGuide";
import WorkoutGuide from "../components/WorkoutGuide";
import MacroChart from "../components/MacroChart";
// UI COMPONENTS
import SummaryHeader from "../components/SummaryHeader";
import MealSection from "../components/MealSection";
import WaterTracker from "../components/WaterTracker";
import WeeklyTrends from "../components/WeeklyTrends"; // Assuming you added this earlier

function Tracker() {
      const { user, logout } = useContext(AuthContext);
  // --- STATE MANAGEMENT ---
  const [foods, setFoods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // NEW: Track which category button was clicked (Default to Breakfast)
  const [targetCategory, setTargetCategory] = useState('Breakfast'); 

  // Date State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Settings & Navigation
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('tracker'); 

  // User Settings
  const [userSettings, setUserSettings] = useState(() => {
    const saved = localStorage.getItem('thaliSettings');
    return saved ? JSON.parse(saved) : { calorieGoal: 2000, proteinGoal: 60, budgetLimit: 500, bodyWeight: 60 };
  });

  useEffect(() => {
    localStorage.setItem('thaliSettings', JSON.stringify(userSettings));
  }, [userSettings]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/foods?date=${selectedDate}`);
        setFoods(data);
      } catch (error) {
        console.error("Error fetching food:", error);
        toast.error("Failed to load history.");
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, [selectedDate]);

  // --- HANDLERS ---
  
  // NEW: Helper to open form with a specific category
  const handleOpenForm = (category = 'Breakfast') => {
    setTargetCategory(category); // Remember "Lunch" or "Dinner"
    setShowForm(true); // Open the modal
  };

  const addNewFood = (newFood) => {
    setFoods([newFood, ...foods]);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    const originalFoods = [...foods];
    setFoods(foods.filter((food) => food._id !== id));
    try {
      await axios.delete(`/api/foods/${id}`);
      toast.success("Meal removed.");
    } catch (error) {
      setFoods(originalFoods);
      toast.error("Failed to delete.");
    }
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans pb-24">
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />

      <div className="max-w-3xl mx-auto p-4 md:p-6">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-orange-600 tracking-tight">🍛 ThaliTrack</h1>
            <p className="text-gray-500 text-xs font-medium">Desi Nutrition & Budget</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-gray-400 text-sm">📅</span>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="outline-none text-gray-700 font-bold text-sm bg-transparent"
              />
            </div>
            
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition shadow-sm text-gray-600"
            >
              ⚙️
            </button>
            
   {/* Logout */}
   <button onClick={logout} className="text-xs text-red-500 font-bold hover:underline ml-2">
      Logout
   </button>
          </div>
        </header>

        {/* TABS */}
        <div className="flex justify-center mb-8">
            <div className="flex bg-gray-200 rounded-full p-1 gap-1">
                <button onClick={() => setActiveTab('tracker')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'tracker' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Diary</button>
                <button onClick={() => setActiveTab('diet')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'diet' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Diet Plans</button>
                <button onClick={() => setActiveTab('workout')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'workout' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Workouts</button>
            </div>
        </div>

        {/* VIEW: TRACKER */}
        {activeTab === 'tracker' && (
          <div className="animate-fade-in">
            <SummaryHeader foods={foods} goals={userSettings} />

            {loading ? (
              <div className="py-20 text-center"><p className="text-gray-400 animate-pulse">Loading your diary...</p></div>
            ) : (
              <div className="space-y-6">
                {/* 
                   UPDATED SECTIONS: 
                   We pass 'onAddClick' which calls 'handleOpenForm' with the specific category title 
                */}
                <MealSection 
                  title="Breakfast" 
                  foods={foods.filter(f => f.category === 'Breakfast')} 
                  onDelete={handleDelete} 
                  onAddClick={() => handleOpenForm('Breakfast')} 
                />
                
                <MealSection 
                  title="Lunch" 
                  foods={foods.filter(f => f.category === 'Lunch')} 
                  onDelete={handleDelete} 
                  onAddClick={() => handleOpenForm('Lunch')}
                />

                <MealSection 
                  title="Dinner" 
                  foods={foods.filter(f => f.category === 'Dinner')} 
                  onDelete={handleDelete} 
                  onAddClick={() => handleOpenForm('Dinner')}
                />

                <MealSection 
                  title="Snack" 
                  foods={foods.filter(f => f.category === 'Snack')} 
                  onDelete={handleDelete} 
                  onAddClick={() => handleOpenForm('Snack')}
                />
              </div>
            )}

            <div className="mt-8"><WaterTracker date={selectedDate} /></div>

            <div className="mt-6 bg-green-50 rounded-xl border border-green-200 p-5 flex justify-between items-center shadow-sm">
                <div>
                    <h3 className="font-bold text-green-800">Total Spent Today</h3>
                    <p className="text-xs text-green-600 font-medium mt-1">Daily Limit: ₹{userSettings.budgetLimit}</p>
                </div>
                <p className="text-3xl font-extrabold text-green-700 tracking-tight">₹{foods.reduce((acc, curr) => acc + Number(curr.approxCost), 0)}</p>
            </div>

            <div className="mt-6"><MacroChart foods={foods} /></div>

              {/* 6. WEEKLY TRENDS (Bar Chart) - ADD THIS BLOCK */}
            <div className="mt-6">
               <WeeklyTrends />
            </div>


            {/* FAB Button - Opens generic form (Defaults to Breakfast) */}
            {isToday && (
              <button 
                onClick={() => handleOpenForm('Breakfast')}
                className="fixed bottom-8 right-8 bg-orange-600 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-4xl font-light hover:bg-orange-700 hover:scale-105 transition-all z-40"
                style={{ boxShadow: '0 4px 14px rgba(234, 88, 12, 0.4)' }}
              >
                +
              </button>
            )}
          </div>
        )}

        {activeTab === 'diet' && <DietGuide />}
        {activeTab === 'workout' && <WorkoutGuide />}

      </div>

      {/* MODALS */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-end md:items-center z-50 p-0 md:p-4">
            <div className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                   <h3 className="font-bold text-gray-700">Add to {targetCategory}</h3>
                   <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
                </div>
                <div className="p-4 max-h-[80vh] overflow-y-auto">
                    {/* PASS THE TARGET CATEGORY TO THE FORM */}
                    <AddFoodForm onAdd={addNewFood} defaultCategory={targetCategory} />
                </div>
            </div>
        </div>
      )}

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        currentSettings={userSettings}
        onSave={setUserSettings}
      />  
    </div>
  );
}

export default Tracker;