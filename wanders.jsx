import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Users, 
  Calendar, 
  DollarSign, 
  Footprints, 
  Car,
  Bus, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  SkipForward, 
  Copy, 
  Check, 
  Search, 
  ArrowRight,
  RotateCcw,
  Sparkles,
  Plane,
  AlertCircle,
  Coffee,
  Mountain,
  Sun,
  CloudRain,
  Music,
  Camera,
  Heart
} from 'lucide-react';

// --- EXPANDED DATA LIBRARY ---

// 1. KEYWORDS (Now ~150 items)
const KEYWORDS = [
  // --- Nature & Geography ---
  { id: 1, label: "Sandy Beaches", category: "Nature", icon: "🏖️" },
  { id: 2, label: "Rocky Mountains", category: "Nature", icon: "⛰️" },
  { id: 3, label: "Deep Forests", category: "Nature", icon: "🌲" },
  { id: 4, label: "Desert Dunes", category: "Nature", icon: "🐪" },
  { id: 5, label: "Jungles", category: "Nature", icon: "🦜" },
  { id: 6, label: "Snowy Landscapes", category: "Nature", icon: "❄️" },
  { id: 7, label: "Lakes", category: "Nature", icon: "🛶" },
  { id: 8, label: "Rivers", category: "Nature", icon: "🌊" },
  { id: 9, label: "Waterfalls", category: "Nature", icon: "🚿" },
  { id: 10, label: "Volcanoes", category: "Nature", icon: "🌋" },
  { id: 11, label: "Caves", category: "Nature", icon: "🦇" },
  { id: 12, label: "Islands", category: "Nature", icon: "🏝️" },
  { id: 13, label: "Coral Reefs", category: "Nature", icon: "🐠" },
  { id: 14, label: "Cliffs", category: "Nature", icon: "🧗" },
  { id: 15, label: "Hot Springs", category: "Nature", icon: "♨️" },
  { id: 16, label: "Northern Lights", category: "Nature", icon: "🌌" },
  { id: 17, label: "Sunset Views", category: "Nature", icon: "🌅" },
  { id: 18, label: "Stargazing", category: "Nature", icon: "🔭" },
  { id: 19, label: "Botanical Gardens", category: "Nature", icon: "🌸" },
  { id: 20, label: "Farming/Agrotourism", category: "Nature", icon: "🚜" },
  { id: 21, label: "Glaciers", category: "Nature", icon: "🧊" },
  { id: 22, label: "Canyons", category: "Nature", icon: "🏜️" },
  { id: 23, label: "Fjords", category: "Nature", icon: "🛥️" },
  { id: 24, label: "Savanna", category: "Nature", icon: "🦒" },
  { id: 25, label: "Bamboo Forests", category: "Nature", icon: "🎋" },

  // --- Urban & Vibe ---
  { id: 30, label: "Skyscrapers", category: "Urban", icon: "🏙️" },
  { id: 31, label: "Small Villages", category: "Urban", icon: "🏡" },
  { id: 32, label: "Bustling Crowds", category: "Urban", icon: "👥" },
  { id: 33, label: "Total Seclusion", category: "Vibe", icon: "🤫" },
  { id: 34, label: "Luxury Vibe", category: "Vibe", icon: "💎" },
  { id: 35, label: "Budget Friendly", category: "Vibe", icon: "🪙" },
  { id: 36, label: "Romantic", category: "Vibe", icon: "🌹" },
  { id: 37, label: "Party Scene", category: "Vibe", icon: "🥳" },
  { id: 38, label: "Family Friendly", category: "Vibe", icon: "👨‍👩‍👧" },
  { id: 39, label: "Solo Travel Safe", category: "Vibe", icon: "🎒" },
  { id: 40, label: "Digital Nomad Hub", category: "Vibe", icon: "💻" },
  { id: 41, label: "Hippie/Boho", category: "Vibe", icon: "☮️" },
  { id: 42, label: "Fast Paced", category: "Vibe", icon: "🏃" },
  { id: 43, label: "Slow Living", category: "Vibe", icon: "🐢" },
  { id: 44, label: "Safety First", category: "Vibe", icon: "🛡️" },
  { id: 45, label: "Adventure Risk", category: "Vibe", icon: "⚠️" },
  { id: 46, label: "LGBTQ+ Friendly", category: "Vibe", icon: "🏳️‍🌈" },
  { id: 47, label: "Spiritual", category: "Vibe", icon: "🕉️" },
  { id: 48, label: "Futuristic", category: "Vibe", icon: "🚀" },
  { id: 49, label: "Old World Charm", category: "Vibe", icon: "🕰️" },

  // --- Culture & History ---
  { id: 50, label: "Ancient Ruins", category: "Culture", icon: "🏺" },
  { id: 51, label: "Castles", category: "Culture", icon: "🏰" },
  { id: 52, label: "Temples", category: "Culture", icon: "🏯" },
  { id: 53, label: "Churches/Cathedrals", category: "Culture", icon: "⛪" },
  { id: 54, label: "Mosques", category: "Culture", icon: "🕌" },
  { id: 55, label: "Museums", category: "Culture", icon: "🖼️" },
  { id: 56, label: "Art Galleries", category: "Culture", icon: "🎨" },
  { id: 57, label: "Street Art", category: "Culture", icon: "🖍️" },
  { id: 58, label: "Opera/Theater", category: "Culture", icon: "🎭" },
  { id: 59, label: "Live Music", category: "Culture", icon: "🎸" },
  { id: 60, label: "Festivals", category: "Culture", icon: "🎉" },
  { id: 61, label: "Indigenous Culture", category: "Culture", icon: "🗿" },
  { id: 62, label: "History Tours", category: "Culture", icon: "📜" },
  { id: 63, label: "Local Language", category: "Culture", icon: "🗣️" },
  { id: 64, label: "Royal Palaces", category: "Culture", icon: "👑" },
  { id: 65, label: "Libraries", category: "Culture", icon: "📚" },

  // --- Food & Drink (Expanded) ---
  { id: 70, label: "Street Food", category: "Food", icon: "🍜" },
  { id: 71, label: "Fine Dining", category: "Food", icon: "🍽️" },
  { id: 72, label: "Fresh Seafood", category: "Food", icon: "🦞" },
  { id: 73, label: "Vegan Options", category: "Food", icon: "🥗" },
  { id: 74, label: "Steak/BBQ", category: "Food", icon: "🍖" },
  { id: 75, label: "Spicy Food", category: "Food", icon: "🌶️" },
  { id: 76, label: "Coffee Culture", category: "Food", icon: "☕" },
  { id: 77, label: "Wine Tasting", category: "Food", icon: "🍷" },
  { id: 78, label: "Craft Beer", category: "Food", icon: "🍺" },
  { id: 79, label: "Cocktail Bars", category: "Food", icon: "🍸" },
  { id: 80, label: "Bakeries", category: "Food", icon: "🥐" },
  { id: 81, label: "Cooking Classes", category: "Food", icon: "👨‍🍳" },
  { id: 82, label: "Pizza", category: "Food", icon: "🍕" },
  { id: 83, label: "Sushi", category: "Food", icon: "🍣" },
  { id: 84, label: "Chocolate", category: "Food", icon: "🍫" },
  { id: 85, label: "Tacos", category: "Food", icon: "🌮" },
  { id: 86, label: "Curry", category: "Food", icon: "🍛" },
  { id: 87, label: "Cheese", category: "Food", icon: "🧀" },
  { id: 88, label: "Dim Sum", category: "Food", icon: "🥟" },
  { id: 89, label: "Whiskey/Spirits", category: "Food", icon: "🥃" },
  { id: 90, label: "Food Markets", category: "Food", icon: "🍱" },
  { id: 91, label: "Tea Culture", category: "Food", icon: "🍵" },
  { id: 92, label: "Halal Food", category: "Food", icon: "🥩" },
  { id: 93, label: "Kosher Food", category: "Food", icon: "🕍" },
  { id: 94, label: "Gluten Free", category: "Food", icon: "🌾" },

  // --- Activities ---
  { id: 100, label: "Hiking", category: "Activity", icon: "🥾" },
  { id: 101, label: "Surfing", category: "Activity", icon: "🏄" },
  { id: 102, label: "Skiing/Snowboarding", category: "Activity", icon: "🏂" },
  { id: 103, label: "Scuba Diving", category: "Activity", icon: "🤿" },
  { id: 104, label: "Snorkeling", category: "Activity", icon: "👓" },
  { id: 105, label: "Yoga", category: "Activity", icon: "🧘" },
  { id: 106, label: "Meditation", category: "Activity", icon: "🧠" },
  { id: 107, label: "Spa/Massages", category: "Activity", icon: "💆" },
  { id: 108, label: "Theme Parks", category: "Activity", icon: "🎢" },
  { id: 109, label: "Water Parks", category: "Activity", icon: "👙" },
  { id: 110, label: "Casinos", category: "Activity", icon: "🎰" },
  { id: 111, label: "Nightclubs", category: "Activity", icon: "💃" },
  { id: 112, label: "Shopping Malls", category: "Activity", icon: "🛍️" },
  { id: 113, label: "Flea Markets", category: "Activity", icon: "🧺" },
  { id: 114, label: "Biking", category: "Activity", icon: "🚲" },
  { id: 115, label: "Kayaking", category: "Activity", icon: "🚣" },
  { id: 116, label: "Fishing", category: "Activity", icon: "🎣" },
  { id: 117, label: "Golf", category: "Activity", icon: "⛳" },
  { id: 118, label: "Tennis", category: "Activity", icon: "🎾" },
  { id: 119, label: "Photography", category: "Activity", icon: "📸" },
  { id: 120, label: "Bird Watching", category: "Nature", icon: "🦅" },
  { id: 121, label: "Zoos", category: "Nature", icon: "🦓" },
  { id: 122, label: "Aquariums", category: "Nature", icon: "🐬" },
  { id: 123, label: "Sports Events", category: "Activity", icon: "🏟️" },
  { id: 124, label: "Bungee Jumping", category: "Activity", icon: "🧗‍♀️" },
  { id: 125, label: "Rock Climbing", category: "Activity", icon: "🧗" },
  { id: 126, label: "Pottery/Crafts", category: "Activity", icon: "🏺" },
  { id: 127, label: "Sailing", category: "Activity", icon: "⛵" },
  
  // --- Accommodation ---
  { id: 130, label: "5-Star Hotels", category: "Stay", icon: "🛎️" },
  { id: 131, label: "Hostels", category: "Stay", icon: "🛏️" },
  { id: 132, label: "Camping", category: "Stay", icon: "⛺" },
  { id: 133, label: "Glamping", category: "Stay", icon: "🛖" },
  { id: 134, label: "Boutique Hotels", category: "Stay", icon: "🏨" },
  { id: 135, label: "Resorts", category: "Stay", icon: "🍹" },
  { id: 136, label: "Airbnb/Rentals", category: "Stay", icon: "🏠" },
  { id: 137, label: "Ryokans", category: "Stay", icon: "🎎" },
  { id: 138, label: "Treehouses", category: "Stay", icon: "🌳" },
  { id: 139, label: "Houseboats", category: "Stay", icon: "🛥️" },
  { id: 140, label: "Castles (Stay)", category: "Stay", icon: "🏰" },

  // --- Transport ---
  { id: 150, label: "Road Trips", category: "Transport", icon: "🚗" },
  { id: 151, label: "Train Travel", category: "Transport", icon: "🚂" },
  { id: 152, label: "Cruises", category: "Transport", icon: "🚢" },
  { id: 153, label: "Motorcycles", category: "Transport", icon: "🏍️" },
  { id: 154, label: "Walking Friendly", category: "Transport", icon: "🚶" },
  { id: 155, label: "Public Transit", category: "Transport", icon: "🚌" },
  { id: 156, label: "Tuk Tuks", category: "Transport", icon: "🛺" },
  { id: 157, label: "Campervans", category: "Transport", icon: "🚐" },

  // --- Weather/Misc ---
  { id: 160, label: "Warm Weather", category: "Weather", icon: "☀️" },
  { id: 161, label: "Cold/Snowy", category: "Weather", icon: "☃️" },
  { id: 162, label: "Rainy/Moody", category: "Weather", icon: "🌧️" },
  { id: 163, label: "Tropical", category: "Weather", icon: "🌴" },
  { id: 164, label: "Dry/Arid", category: "Weather", icon: "🌵" },
  { id: 165, label: "English Spoken", category: "Vibe", icon: "🇬🇧" },
  { id: 166, label: "Comics/Anime", category: "Vibe", icon: "👾" },
  { id: 167, label: "Tech Scenes", category: "Vibe", icon: "🤖" },
  { id: 168, label: "Fashion", category: "Vibe", icon: "👗" },
  { id: 169, label: "Hidden Gems", category: "Vibe", icon: "🗝️" },
  { id: 170, label: "Iconic Landmarks", category: "Vibe", icon: "🗽" },
  { id: 171, label: "Coworking Spaces", category: "Work", icon: "🏢" },
  { id: 172, label: "Fast Internet", category: "Work", icon: "📶" }
];

// 2. DESTINATIONS (Now ~50 items)
const DESTINATIONS = [
  { name: "Amalfi Coast, Italy", tier: 3, tags: ["Beaches", "Luxury Vibe", "Fine Dining", "Road Trips", "Cliffs", "Romantic", "Wine Tasting"] },
  { name: "Bali, Indonesia", tier: 1, tags: ["Beaches", "Yoga", "Street Food", "Jungles", "Surfing", "Digital Nomad Hub", "Temples", "Spiritual"] },
  { name: "Kyoto, Japan", tier: 2, tags: ["Temples", "Gardens", "Fine Dining", "History Tours", "Ryokans", "Safety First", "Tea Culture"] },
  { name: "Banff, Canada", tier: 2, tags: ["Rocky Mountains", "Lakes", "Skiing/Snowboarding", "Hiking", "Wildlife", "Camping", "Cold/Snowy"] },
  { name: "New York City, USA", tier: 3, tags: ["Skyscrapers", "Shopping Malls", "Museums", "Fine Dining", "Fast Paced", "Walking Friendly", "Theater"] },
  { name: "Chiang Mai, Thailand", tier: 1, tags: ["Street Food", "Temples", "Rocky Mountains", "Festivals", "Digital Nomad Hub", "Markets", "Cooking Classes"] },
  { name: "Reykjavik, Iceland", tier: 3, tags: ["Northern Lights", "Hot Springs", "Road Trips", "Volcanoes", "Waterfalls", "Safety First", "Cold/Snowy"] },
  { name: "Paris, France", tier: 3, tags: ["Museums", "Art Galleries", "Fine Dining", "Romantic", "Architecture", "Walking Friendly", "Bakeries"] },
  { name: "Cape Town, South Africa", tier: 2, tags: ["Beaches", "Rocky Mountains", "Wine Tasting", "History Tours", "Surfing", "Penguins"] },
  { name: "Marrakech, Morocco", tier: 1, tags: ["Markets", "Desert Dunes", "Spicy Food", "Architecture", "Luxury Vibe", "History Tours", "Riads"] },
  { name: "Tokyo, Japan", tier: 2, tags: ["Skyscrapers", "Comics/Anime", "Sushi", "Safety First", "Shopping Malls", "Nightclubs", "Tech Scenes"] },
  { name: "Cairo, Egypt", tier: 1, tags: ["Ancient Ruins", "Desert Dunes", "History Tours", "Museums", "Rivers", "Bustling Crowds", "Mosques"] },
  { name: "Queenstown, NZ", tier: 2, tags: ["Adventure Risk", "Lakes", "Skiing/Snowboarding", "Hiking", "Bungee Jumping", "Safety First"] },
  { name: "Barcelona, Spain", tier: 2, tags: ["Architecture", "Beaches", "Party Scene", "Seafood", "Street Art", "Walking Friendly", "Tapas"] },
  { name: "Santorini, Greece", tier: 3, tags: ["Sunset Views", "Islands", "Romantic", "Wine Tasting", "Luxury Vibe", "Cliffs"] },
  { name: "Cusco, Peru", tier: 1, tags: ["Ancient Ruins", "Hiking", "History Tours", "Mountains", "Indigenous Culture", "Alpacas"] },
  { name: "Dubai, UAE", tier: 3, tags: ["Skyscrapers", "Luxury Vibe", "Shopping Malls", "Desert Dunes", "Theme Parks", "Fine Dining"] },
  { name: "Amsterdam, Netherlands", tier: 2, tags: ["Cycling", "Museums", "Canals", "Party Scene", "Walking Friendly", "Coffee Culture"] },
  { name: "Rio de Janeiro, Brazil", tier: 2, tags: ["Beaches", "Party Scene", "Festivals", "Mountains", "Cristo Redentor", "Bustling Crowds"] },
  { name: "Istanbul, Turkey", tier: 1, tags: ["Mosques", "Markets", "Street Food", "History Tours", "Tea Culture", "Cats", "Coffee Culture"] },
  { name: "Seoul, South Korea", tier: 2, tags: ["Skyscrapers", "Street Food", "Shopping Malls", "Safe", "Karaoke", "Technology", "Fashion"] },
  { name: "Costa Rica", tier: 2, tags: ["Jungles", "Wildlife", "Surfing", "Ziplining", "Eco Tourism", "Beaches", "Volcanoes"] },
  { name: "Prague, Czech Republic", tier: 1, tags: ["Beer Culture", "Castles", "History Tours", "Architecture", "Budget Friendly", "Walking Friendly"] },
  { name: "Maldives", tier: 3, tags: ["Islands", "Beaches", "Scuba Diving", "Resorts", "Luxury Vibe", "Romance", "Tropical"] },
  { name: "Lisbon, Portugal", tier: 2, tags: ["Hills", "Seafood", "Wine Tasting", "Surfing", "Digital Nomad Hub", "Safe", "Trams"] },
  { name: "Sydney, Australia", tier: 3, tags: ["Beaches", "Opera/Theater", "Surfing", "Harbor", "Safe", "Coffee Culture", "Sports Events"] },
  { name: "Patagonia, Chile/Arg", tier: 2, tags: ["Glaciers", "Hiking", "Rocky Mountains", "Nature", "Wildlife", "Remote", "Windy"] },
  { name: "Lapland, Finland", tier: 3, tags: ["Santa Claus", "Northern Lights", "Reindeer", "Snowy Landscapes", "Igloos", "Saunas"] },
  { name: "Havana, Cuba", tier: 1, tags: ["Old World Charm", "Live Music", "Beaches", "History Tours", "Cigars", "Cars"] },
  { name: "Bora Bora", tier: 3, tags: ["Islands", "Resorts", "Luxury Vibe", "Snorkeling", "Tropical", "Relaxation"] },
  { name: "Mexico City, Mexico", tier: 1, tags: ["Street Food", "Museums", "History Tours", "Art Galleries", "Tacos", "Bustling Crowds"] },
  { name: "Vancouver, Canada", tier: 3, tags: ["Mountains", "Ocean", "Sushi", "Walking Friendly", "Nature", "Cycling"] },
  { name: "Dubrovnik, Croatia", tier: 2, tags: ["Game of Thrones", "Walls", "Beaches", "History Tours", "Ocean", "Seafood"] },
  { name: "Petra, Jordan", tier: 2, tags: ["Ancient Ruins", "Desert Dunes", "History Tours", "Camels", "Adventure", "Hiking"] },
  { name: "New Orleans, USA", tier: 2, tags: ["Live Music", "Festivals", "Food", "History Tours", "Nightlife", "Unique"] },
  { name: "Galapagos Islands", tier: 3, tags: ["Wildlife", "Nature", "Snorkeling", "Remote", "Islands", "Science"] },
  { name: "Berlin, Germany", tier: 2, tags: ["History Tours", "Nightclubs", "Street Art", "Museums", "Beer Culture", "Alternative"] },
  { name: "Las Vegas, USA", tier: 2, tags: ["Casinos", "Shows", "Luxury Vibe", "Party Scene", "Fine Dining", "Desert"] },
  { name: "Serengeti, Tanzania", tier: 3, tags: ["Safari", "Wildlife", "Nature", "Camping", "Photography", "Savanna"] },
  { name: "Bhutan", tier: 3, tags: ["Mountains", "Temples", "Spiritual", "Remote", "Nature", "Culture"] },
  { name: "Edinburgh, Scotland", tier: 2, tags: ["Castles", "Festivals", "History Tours", "Pubs", "Literature", "Rainy/Moody"] },
  { name: "Austin, Texas", tier: 2, tags: ["Live Music", "BBQ", "Lakes", "Nightlife", "Warm Weather", "Cowboys"] },
  { name: "Copenhagen, Denmark", tier: 3, tags: ["Design", "Cycling", "Food", "Hygge", "Happy", "Canals"] },
  { name: "Oaxaca, Mexico", tier: 1, tags: ["Food", "Culture", "Festivals", "Markets", "Mezcal", "History"] },
  { name: "Siem Reap, Cambodia", tier: 1, tags: ["Temples", "History", "Budget Friendly", "Sunrises", "Culture"] }
];

export default function App() {
  const [step, setStep] = useState(0); // 0: Form, 1: Swipe, 2: Results
  const [formData, setFormData] = useState({
    duration: "",
    travelers: "",
    budget: "",
    drive: false,
    publicTransport: false,
    walking: false,
  });
  
  const [liked, setLiked] = useState([]);
  const [hated, setHated] = useState([]);
  const [later, setLater] = useState([]);

  // Initialize with a shuffle immediately to prevent empty deck flicker
  const [shuffledKeywords, setShuffledKeywords] = useState(() => {
    const array = [...KEYWORDS];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  });

  const handleStart = (data) => {
    setFormData(data);
    setStep(1);
  };

  const handleFinish = (likedItems, hatedItems, laterItems) => {
    setLiked(likedItems);
    setHated(hatedItems);
    setLater(laterItems);
    setStep(2);
  };

  const handleReset = () => {
    setStep(0);
    setLiked([]);
    setHated([]);
    setLater([]);
    // Reshuffle for next time
    const array = [...KEYWORDS];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setShuffledKeywords(array);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-100">
      <div className="max-w-md mx-auto h-screen bg-white shadow-2xl relative flex flex-col">
        
        {/* Header */}
        <header className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold transform -rotate-3 shadow-sm">
              W
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">WanderSwipe</h1>
          </div>
          {step > 0 && (
            <button onClick={handleReset} className="text-sm text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1">
              <RotateCcw size={16} /> Restart
            </button>
          )}
        </header>

        {/* Main Content - Using explicit overflow handling to fix layout bug */}
        <main className={`flex-1 relative bg-slate-50 ${step === 1 ? 'overflow-hidden' : 'overflow-y-auto scrollbar-hide'}`}>
          {step === 0 && <TripForm onSubmit={handleStart} initialData={formData} />}
          
          {/* SwipeDeck needs full height without scrolling */}
          {step === 1 && (
             <div className="absolute inset-0">
                <SwipeDeck items={shuffledKeywords} onFinish={handleFinish} />
             </div>
          )}
          
          {step === 2 && (
            <Results 
              liked={liked} 
              hated={hated} 
              formData={formData} 
              destinations={DESTINATIONS}
            />
          )}
        </main>

      </div>
    </div>
  );
}

// --- STEP 1: INPUT FORM ---

function TripForm({ onSubmit, initialData }) {
  const [data, setData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const isBlank = !data.duration && !data.budget && !data.travelers && !data.drive && !data.publicTransport && !data.walking;

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2 mt-4">
        <h2 className="text-3xl font-black text-slate-800">Plan your Escape</h2>
        <p className="text-slate-500 text-sm">Fill in what you know, leave the rest blank.</p>
      </div>

      <div className="space-y-6">
        
        {/* Duration */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <Calendar size={16} className="text-rose-500" />
            Duration (Days) <span className="text-slate-300 font-normal ml-auto text-xs">Optional</span>
          </label>
          <input 
            type="number" 
            name="duration"
            value={data.duration}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all placeholder:text-slate-300"
            placeholder="e.g. 7"
          />
        </div>

        {/* Travelers */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <Users size={16} className="text-rose-500" />
            Travelers <span className="text-slate-300 font-normal ml-auto text-xs">Optional</span>
          </label>
          <input 
            type="number" 
            name="travelers"
            value={data.travelers}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all placeholder:text-slate-300"
            placeholder="e.g. 2"
          />
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <DollarSign size={16} className="text-rose-500" />
            Budget per person (USD) <span className="text-slate-300 font-normal ml-auto text-xs">Optional</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-slate-400 font-bold">$</span>
            <input 
              type="number" 
              name="budget"
              value={data.budget}
              onChange={handleChange}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all placeholder:text-slate-300"
              placeholder="e.g. 2000"
            />
          </div>
          <p className="text-[10px] text-slate-400 pl-1">Leave blank to see all price ranges.</p>
        </div>

        {/* Preferences Toggles */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">Transport Preferences (Optional)</label>
          
          <Toggle 
            label="Willing to Drive" 
            icon={<Car size={18} />} 
            checked={data.drive} 
            onChange={(v) => setData(p => ({...p, drive: v}))} 
          />
          <Toggle 
            label="Public Transport" 
            icon={<Bus size={18} />} 
            checked={data.publicTransport} 
            onChange={(v) => setData(p => ({...p, publicTransport: v}))} 
          />
          <Toggle 
            label="Love Walking" 
            icon={<Footprints size={18} />} 
            checked={data.walking} 
            onChange={(v) => setData(p => ({...p, walking: v}))} 
          />
        </div>
      </div>

      <div className="pt-4 pb-10">
        <button 
          onClick={() => onSubmit(data)}
          className="w-full py-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-lg rounded-xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 group"
        >
          {isBlank ? "Skip to Swiping" : "Start Swiping"} 
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
        </button>
      </div>
    </div>
  );
}

function Toggle({ label, icon, checked, onChange }) {
  return (
    <button 
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
        checked 
          ? 'bg-rose-50 border-rose-200 text-rose-900 shadow-sm' 
          : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`${checked ? 'text-rose-500' : 'text-slate-300'}`}>
          {icon}
        </div>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
        checked ? 'bg-rose-500 border-rose-500' : 'bg-transparent border-slate-300'
      }`}>
        {checked && <Check size={12} className="text-white" />}
      </div>
    </button>
  );
}


// --- STEP 2: SWIPE DECK ---

function SwipeDeck({ items, onFinish }) {
  const [stack, setStack] = useState(items);
  const [liked, setLiked] = useState([]);
  const [hated, setHated] = useState([]);
  const [later, setLater] = useState([]);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stack.length === 0) return;
      if (e.key === 'ArrowRight') handleSwipe('right');
      if (e.key === 'ArrowLeft') handleSwipe('left');
      if (e.key === 'ArrowUp') handleSwipe('up');
      if (e.key === 'ArrowDown') handleSwipe('down');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stack]);

  const currentCard = stack[0];

  const handlePointerDown = (e) => {
    if (stack.length === 0) return;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    
    if (offset.x > threshold) handleSwipe('right');
    else if (offset.x < -threshold) handleSwipe('left');
    else if (offset.y > threshold) handleSwipe('down');
    else if (offset.y < -threshold) handleSwipe('up');
    else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const handleSwipe = (direction) => {
    if (!currentCard) return;

    if (direction === 'right') setLiked(prev => [...prev, currentCard]);
    if (direction === 'left') setHated(prev => [...prev, currentCard]);
    if (direction === 'down') setLater(prev => [...prev, currentCard]);

    setOffset({ x: 0, y: 0 }); 
    setStack(prev => prev.slice(1));
  };

  const finishSwiping = () => {
    onFinish(liked, hated, later);
  };

  const getCardStyle = () => {
    const rotate = offset.x * 0.05; 
    let borderColor = 'transparent';
    if (offset.x > 50) borderColor = '#4ade80'; 
    if (offset.x < -50) borderColor = '#f87171'; 
    if (offset.y > 50) borderColor = '#fbbf24'; 
    if (offset.y < -50) borderColor = '#94a3b8'; 

    return {
      transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotate}deg)`,
      border: `2px solid ${borderColor}`,
      cursor: isDragging ? 'grabbing' : 'grab',
      transition: isDragging ? 'none' : 'transform 0.3s ease-out'
    };
  };

  const getOverlay = () => {
    if (offset.x > 50) return <div className="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-black text-4xl p-2 rounded transform -rotate-12 bg-white/90 z-20 shadow-xl backdrop-blur-sm">LIKE</div>;
    if (offset.x < -50) return <div className="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-black text-4xl p-2 rounded transform rotate-12 bg-white/90 z-20 shadow-xl backdrop-blur-sm">NOPE</div>;
    if (offset.y > 50) return <div className="absolute top-12 w-full text-center text-amber-500 font-black text-4xl bg-white/90 py-2 z-20 shadow-xl backdrop-blur-sm">LATER</div>;
    if (offset.y < -50) return <div className="absolute bottom-16 w-full text-center text-slate-400 font-black text-4xl bg-white/90 py-2 z-20 shadow-xl backdrop-blur-sm">SKIP</div>;
    return null;
  };

  if (stack.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
          <Sparkles size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Wow, you went through everything!</h2>
        <p className="text-slate-500 mb-8">We have plenty of data now.</p>
        <button 
          onClick={finishSwiping}
          className="w-full py-4 bg-rose-600 text-white font-bold rounded-xl shadow-lg hover:bg-rose-700 transition-all"
        >
          See Results
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden relative">
      {/* Instructions */}
      <div className="h-14 shrink-0 flex items-center justify-center text-slate-400 text-[10px] font-bold tracking-widest uppercase gap-3 sm:gap-8 pt-2 z-0">
        <span className="flex items-center gap-1"><ArrowRight className="rotate-180 text-red-400" size={14}/> Hate</span>
        <span className="flex items-center gap-1"><ArrowRight className="-rotate-90 text-slate-400" size={14}/> Skip</span>
        <span className="flex items-center gap-1"><ArrowRight className="rotate-90 text-amber-400" size={14}/> Later</span>
        <span className="flex items-center gap-1 text-green-500">Like <ArrowRight size={14}/></span>
      </div>

      {/* Card Area */}
      <div className="flex-1 relative flex items-center justify-center w-full z-10">
        {/* Background stack effect */}
        {stack.length > 1 && (
          <div className="absolute w-[82%] h-[60%] bg-white rounded-3xl shadow-sm scale-90 translate-y-6 opacity-40 border border-slate-200"></div>
        )}
         {stack.length > 2 && (
          <div className="absolute w-[86%] h-[60%] bg-white rounded-3xl shadow-sm scale-95 translate-y-3 opacity-70 border border-slate-200"></div>
        )}

        <div 
          ref={cardRef}
          className="absolute w-[92%] max-w-[360px] h-[65%] bg-white rounded-3xl shadow-xl flex flex-col items-center justify-between p-8 border border-slate-100 select-none touch-none"
          style={getCardStyle()}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {getOverlay()}
          
          <div className="absolute top-6 right-6 text-xs font-bold text-slate-300">
             {items.length - stack.length + 1} / {items.length}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="text-9xl mb-8 transform hover:scale-110 transition-transform duration-300 cursor-grab active:cursor-grabbing filter drop-shadow-sm">{currentCard.icon}</div>
            <h2 className="text-3xl font-black text-slate-800 text-center leading-tight mb-3 px-2">{currentCard.label}</h2>
            <span className="px-4 py-1.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-full uppercase tracking-wider border border-rose-100">
              {currentCard.category}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pb-8 shrink-0 grid grid-cols-4 gap-4 max-w-md mx-auto w-full z-20">
        <ActionButton icon={<ThumbsDown size={22} />} color="text-red-500 bg-white shadow-lg hover:bg-red-50 hover:scale-110" onClick={() => handleSwipe('left')} />
        <ActionButton icon={<SkipForward size={22} className="-rotate-90" />} color="text-slate-400 bg-white shadow-lg hover:bg-slate-50 hover:scale-110" onClick={() => handleSwipe('up')} />
        <ActionButton icon={<Clock size={22} />} color="text-amber-500 bg-white shadow-lg hover:bg-amber-50 hover:scale-110" onClick={() => handleSwipe('down')} />
        <ActionButton icon={<ThumbsUp size={22} />} color="text-green-500 bg-white shadow-lg hover:bg-green-50 hover:scale-110" onClick={() => handleSwipe('right')} />
      </div>

      <div className="absolute bottom-2 w-full text-center pb-2 z-0">
        <button 
          onClick={finishSwiping} 
          className="py-1 px-4 rounded-full text-slate-400 font-bold text-[10px] hover:text-rose-600 transition-colors uppercase tracking-widest"
        >
          Finish & See Results ({liked.length})
        </button>
      </div>
    </div>
  );
}

function ActionButton({ icon, color, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center transition-all active:scale-90 ${color}`}
    >
      {icon}
    </button>
  );
}

// --- STEP 3: RESULTS ---

function Results({ liked, hated, formData, destinations }) {
  const [copied, setCopied] = useState(false);

  // Recommendation Algorithm
  const recommendations = useMemo(() => {
    // 1. Calculate Budget Tier (if budget is provided)
    let budgetTier = null; 
    if (formData.budget) {
      const budget = parseInt(formData.budget);
      if (!isNaN(budget)) {
        if (budget < 1500) budgetTier = 1;
        else if (budget > 4000) budgetTier = 3;
        else budgetTier = 2;
      }
    }

    // 2. Score Destinations
    return destinations.map(dest => {
      let score = 0;
      
      // Budget matching (only if budget provided)
      if (budgetTier !== null) {
        if (dest.tier > budgetTier) score -= 15; // Too expensive
        else if (dest.tier === budgetTier) score += 5; // Perfect match
        else score += 2; // Under budget
      }

      // Keyword Matching
      const likedLabels = liked.map(l => l.label);
      const hatedLabels = hated.map(h => h.label);

      // Match logic
      let hitCount = 0;
      dest.tags.forEach(tag => {
        // Direct tag match
        if (likedLabels.includes(tag)) {
            score += 15;
            hitCount++;
        }
        // Category Inference (simplified)
        if (likedLabels.includes('Beaches') && dest.tags.includes('Islands')) score += 5;
        if (likedLabels.includes('Walking Friendly') && dest.tags.includes('Walking Friendly')) score += 10;
        if (likedLabels.includes('Spicy Food') && dest.tags.includes('Street Food')) score += 3;
        
        // Hated check
        if (hatedLabels.includes(tag)) score -= 25;
      });

      // Bonus for high overlap
      if (hitCount >= 3) score += 15;

      return { ...dest, score, hitCount };
    })
    .sort((a, b) => b.score - a.score) 
    .filter(d => d.score > -20) // Allow slightly negative if user hated everything but still needs options
    .slice(0, 10); // Top 10
  }, [liked, hated, formData, destinations]);

  const copyToClipboard = () => {
    let text = `My WanderSwipe Trip Profile:\n`;
    if (formData.duration) text += `📅 Duration: ${formData.duration} days\n`;
    if (formData.budget) text += `💰 Budget: $${formData.budget}\n`;
    
    text += `\n💖 I LOVE:\n${liked.map(i => `- ${i.label}`).join('\n')}\n`;
    text += `\n❌ NO THANKS:\n${hated.map(i => `- ${i.label}`).join('\n')}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 pb-20 space-y-8 animate-in slide-in-from-right-8 duration-500">
      
      {/* Parameters Summary */}
      <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs flex flex-wrap gap-4 shadow-lg">
        {formData.duration ? (
            <div className="flex items-center gap-1"><Calendar size={12}/> {formData.duration} Days</div>
        ) : <div className="opacity-50 flex items-center gap-1"><Calendar size={12}/> Flexible Days</div>}
        
        {formData.budget ? (
            <div className="flex items-center gap-1 text-green-400 font-bold"><DollarSign size={12}/> ${formData.budget}</div>
        ) : <div className="opacity-50 flex items-center gap-1"><DollarSign size={12}/> Flexible Budget</div>}

        {formData.travelers ? (
             <div className="flex items-center gap-1"><Users size={12}/> {formData.travelers} ppl</div>
        ) : null}
      </div>

      {/* Top Suggestions */}
      <section>
        <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
          <Plane className="text-rose-500" />
          Top Destinations
        </h2>
        
        <div className="space-y-4">
          {recommendations.length > 0 ? recommendations.map((place, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3 group hover:border-rose-200 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-xl text-slate-800 group-hover:text-rose-600 transition-colors">{place.name}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1 uppercase tracking-wide">
                     <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                        {Array(place.tier).fill('$').join('')}
                     </span>
                     <span>•</span>
                     <span>Match: {place.score} pts</span>
                  </div>
                </div>
                <div className={`text-xs font-bold px-2.5 py-1 rounded-lg ${idx === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                  #{idx + 1}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mt-1">
                {place.tags.map(t => {
                   const isLiked = liked.find(l => l.label === t);
                   return (
                    <span key={t} className={`text-[10px] px-2 py-1 rounded border flex items-center gap-1 ${
                        isLiked 
                        ? 'bg-rose-50 text-rose-700 border-rose-100 font-bold' 
                        : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                        {isLiked && <Check size={8} />} {t}
                    </span>
                   )
                })}
              </div>

              <a 
                href={`https://www.google.com/search?q=flights+hotel+${place.name.replace(' ', '+')}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 w-full py-3 bg-slate-900 text-slate-50 text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors"
              >
                <Search size={14} /> Check Prices & Flights
              </a>
            </div>
          )) : (
            <div className="text-center py-12 px-6 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
              <AlertCircle className="mx-auto mb-2 text-slate-300" size={32} />
              <p className="font-medium">No perfect matches.</p>
              <p className="text-xs mt-1">Your preferences are very unique! Try searching manually or restart with broader horizons.</p>
            </div>
          )}
        </div>
      </section>

      {/* Keyword Summary */}
      <section className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Preference Summary</h2>
          <button 
            onClick={copyToClipboard}
            className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-rose-100 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy List'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50/50 rounded-xl p-4 border border-green-100">
            <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
              <ThumbsUp size={14} /> Loved
            </h3>
            <div className="space-y-2">
              {liked.length === 0 && <p className="text-xs text-green-600/50 italic">Nothing yet...</p>}
              {liked.map(item => (
                <div key={item.id} className="bg-white p-2 rounded-lg border border-green-100 shadow-sm text-xs font-medium text-slate-700 flex items-center gap-2">
                  <span>{item.icon}</span> {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50/50 rounded-xl p-4 border border-red-100">
            <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
              <ThumbsDown size={14} /> Avoid
            </h3>
            <div className="space-y-2">
              {hated.length === 0 && <p className="text-xs text-red-600/50 italic">Nothing yet...</p>}
              {hated.map(item => (
                <div key={item.id} className="bg-white p-2 rounded-lg border border-red-100 shadow-sm text-xs font-medium text-slate-700 flex items-center gap-2">
                   <span>{item.icon}</span> {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
