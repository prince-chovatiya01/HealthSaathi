import React, { useState } from 'react';
import {
  Brain, Dumbbell, Apple, Heart, Moon, Wind, Target, ChevronRight,
  Smile, Meh, Frown, TrendingUp, Activity, Droplets, CheckCircle, Plus, X
} from 'lucide-react';
import PageNav from '../components/common/PageNav';

type Mood = 'great' | 'good' | 'okay' | 'bad' | 'terrible';

interface MoodEntry {
  date: string;
  mood: Mood;
  note: string;
}

interface WaterLog {
  date: string;
  glasses: number;
}

const MOODS: { value: Mood; emoji: string; label: string; color: string }[] = [
  { value: 'great', emoji: '😁', label: 'Great', color: 'bg-green-500' },
  { value: 'good', emoji: '😊', label: 'Good', color: 'bg-emerald-400' },
  { value: 'okay', emoji: '😐', label: 'Okay', color: 'bg-yellow-400' },
  { value: 'bad', emoji: '😔', label: 'Bad', color: 'bg-orange-400' },
  { value: 'terrible', emoji: '😢', label: 'Terrible', color: 'bg-red-500' },
];

const WELLNESS_TIPS = [
  { icon: '💧', title: 'Stay Hydrated', tip: 'Drink 8-10 glasses of water daily to maintain optimal body functions.' },
  { icon: '🚶', title: 'Daily Movement', tip: '30 minutes of moderate exercise daily reduces chronic disease risk by 35%.' },
  { icon: '🥗', title: 'Balanced Diet', tip: 'Fill half your plate with colorful vegetables and fruits at every meal.' },
  { icon: '😴', title: 'Quality Sleep', tip: 'Adults need 7-9 hours of sleep. Keep a consistent sleep schedule.' },
  { icon: '🧘', title: 'Mindfulness', tip: '5 minutes of daily meditation can significantly reduce stress and anxiety.' },
  { icon: '🌤️', title: 'Sunlight', tip: 'Get 15-20 minutes of sunlight daily to boost Vitamin D and mood.' },
];

const EXERCISES = [
  { name: 'Morning Walk', duration: '30 min', calories: 150, icon: '🚶', difficulty: 'Easy' },
  { name: 'Yoga Session', duration: '45 min', calories: 200, icon: '🧘', difficulty: 'Easy' },
  { name: 'Cycling', duration: '30 min', calories: 300, icon: '🚴', difficulty: 'Medium' },
  { name: 'HIIT Workout', duration: '20 min', calories: 350, icon: '💪', difficulty: 'Hard' },
  { name: 'Swimming', duration: '30 min', calories: 400, icon: '🏊', difficulty: 'Medium' },
  { name: 'Meditation', duration: '15 min', calories: 30, icon: '🌸', difficulty: 'Easy' },
];

const WellnessPage = () => {
  const today = new Date().toISOString().split('T')[0];

  // BMI Calculator
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const bmiValue = height && weight ? (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)) : null;
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { label: 'Normal weight', color: 'text-green-500' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  // Mood Tracker
  const [moodLogs, setMoodLogs] = useState<MoodEntry[]>([
    { date: today, mood: 'good', note: 'Feeling energetic after morning walk' }
  ]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [showMoodForm, setShowMoodForm] = useState(false);

  const logMood = () => {
    if (!selectedMood) return;
    setMoodLogs(prev => {
      const existing = prev.findIndex(m => m.date === today);
      const entry = { date: today, mood: selectedMood, note: moodNote };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = entry;
        return updated;
      }
      return [entry, ...prev];
    });
    setSelectedMood(null);
    setMoodNote('');
    setShowMoodForm(false);
  };

  // Water tracker
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([{ date: today, glasses: 3 }]);
  const todayWater = waterLogs.find(w => w.date === today)?.glasses ?? 0;
  const waterGoal = 8;

  const addWater = () => {
    setWaterLogs(prev => {
      const existing = prev.findIndex(w => w.date === today);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], glasses: Math.min(updated[existing].glasses + 1, waterGoal + 4) };
        return updated;
      }
      return [{ date: today, glasses: 1 }, ...prev];
    });
  };

  const removeWater = () => {
    setWaterLogs(prev => {
      const existing = prev.findIndex(w => w.date === today);
      if (existing >= 0 && prev[existing].glasses > 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], glasses: updated[existing].glasses - 1 };
        return updated;
      }
      return prev;
    });
  };

  // Steps Goal
  const [steps, setSteps] = useState(4200);
  const stepsGoal = 10000;
  const stepsPercent = Math.min(Math.round((steps / stepsGoal) * 100), 100);

  const todayMoodEntry = moodLogs.find(m => m.date === today);
  const todayMoodData = MOODS.find(m => m.value === todayMoodEntry?.mood);

  return (
    <div className="hs-page">
      <div className="hs-container-narrow max-w-6xl">
      <PageNav />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Heart className="h-8 w-8 text-indigo-600" />
          Wellness Center
        </h1>
        <p className="text-gray-600 mt-1">Your personal health and wellbeing hub</p>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Mood */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1"><Smile className="h-3 w-3" /> Today's Mood</p>
          {todayMoodData ? (
            <div className="text-center">
              <span className="text-3xl">{todayMoodData.emoji}</span>
              <p className="text-sm font-semibold text-gray-700 mt-1">{todayMoodData.label}</p>
            </div>
          ) : (
            <button
              onClick={() => setShowMoodForm(true)}
              className="w-full text-center text-indigo-600 text-sm font-medium hover:text-indigo-800"
            >
              + Log Mood
            </button>
          )}
        </div>

        {/* Water */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1"><Droplets className="h-3 w-3 text-blue-500" /> Hydration</p>
          <p className="text-3xl font-bold text-blue-600">{todayWater}<span className="text-base text-gray-400">/{waterGoal}</span></p>
          <p className="text-xs text-gray-400 mt-1">glasses</p>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1"><Activity className="h-3 w-3 text-green-500" /> Steps</p>
          <p className="text-3xl font-bold text-green-600">{steps.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Goal: {stepsGoal.toLocaleString()}</p>
        </div>

        {/* Streak */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-md p-4 text-white">
          <p className="text-xs font-medium text-white/80 mb-2 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Wellness Streak</p>
          <p className="text-3xl font-bold">7</p>
          <p className="text-xs text-white/70 mt-1">days in a row 🔥</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Mood Tracker */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" /> Mental Health
            </h2>
            <button
              onClick={() => setShowMoodForm(!showMoodForm)}
              className="text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Log Today
            </button>
          </div>

          {showMoodForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-700 mb-3">How are you feeling today?</p>
              <div className="flex justify-between mb-3">
                {MOODS.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setSelectedMood(m.value)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      selectedMood === m.value ? 'bg-indigo-100 scale-110 ring-2 ring-indigo-400' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-xs text-gray-600">{m.label}</span>
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={moodNote}
                onChange={e => setMoodNote(e.target.value)}
                placeholder="Any notes? (optional)"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={logMood}
                  disabled={!selectedMood}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowMoodForm(false)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-52 overflow-y-auto">
            {moodLogs.slice(0, 7).map((entry, i) => {
              const moodData = MOODS.find(m => m.value === entry.mood);
              return (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{moodData?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{moodData?.label}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {entry.note && <p className="text-xs text-gray-400 truncate">{entry.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Water & Steps */}
        <div className="space-y-6 lg:col-span-1">
          {/* Water Tracker */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Droplets className="h-5 w-5 text-blue-500" /> Water Intake
            </h2>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {Array.from({ length: waterGoal }).map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-10 rounded-lg border-2 transition-colors ${
                    i < todayWater ? 'bg-blue-400 border-blue-500' : 'border-gray-200 bg-gray-50'
                  }`}
                  title={`Glass ${i + 1}`}
                >
                  {i < todayWater && <Droplets className="h-4 w-4 text-white mx-auto mt-2" />}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={removeWater}
                disabled={todayWater === 0}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 font-medium transition-colors text-sm"
              >
                − Remove
              </button>
              <button
                onClick={addWater}
                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
              >
                + Add Glass
              </button>
            </div>
            {todayWater >= waterGoal && (
              <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 p-2 rounded-lg">
                <CheckCircle className="h-4 w-4" /> Daily goal achieved! 🎉
              </div>
            )}
          </div>

          {/* Steps Progress */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-green-500" /> Daily Steps
            </h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-gray-900">{steps.toLocaleString()}</span>
              <span className="text-sm text-gray-500">/ {stepsGoal.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stepsPercent}%` }}
              />
            </div>
            <div className="flex gap-2">
              {[500, 1000, 2000].map(inc => (
                <button
                  key={inc}
                  onClick={() => setSteps(s => s + inc)}
                  className="flex-1 text-xs py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition-colors"
                >
                  +{inc >= 1000 ? `${inc/1000}k` : inc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BMI Calculator */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-orange-500" /> BMI Calculator
          </h2>
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
                placeholder="e.g. 170"
                min="100"
                max="250"
                className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="e.g. 70"
                min="20"
                max="300"
                className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {bmiValue !== null && !isNaN(bmiValue) && (
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-sm text-gray-500 mb-1">Your BMI</p>
              <p className="text-4xl font-bold text-gray-900">{bmiValue.toFixed(1)}</p>
              <p className={`text-sm font-semibold mt-1 ${getBmiCategory(bmiValue).color}`}>
                {getBmiCategory(bmiValue).label}
              </p>
              <div className="mt-3 space-y-1 text-xs text-gray-500">
                <p>Underweight: &lt;18.5 | Normal: 18.5–24.9</p>
                <p>Overweight: 25–29.9 | Obese: ≥30</p>
              </div>
            </div>
          )}

          {(!height || !weight) && (
            <div className="p-4 bg-orange-50 rounded-xl text-center text-orange-700 text-sm">
              Enter your height and weight above to calculate your BMI
            </div>
          )}
        </div>
      </div>

      {/* Exercise Suggestions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-5">
          <Dumbbell className="h-5 w-5 text-indigo-600" /> Recommended Exercises
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXERCISES.map(ex => (
            <div key={ex.name} className="p-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 group cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{ex.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{ex.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    ex.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    ex.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>{ex.difficulty}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>⏱ {ex.duration}</span>
                <span>🔥 {ex.calories} cal</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness Tips */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-5">
          <Apple className="h-5 w-5 text-green-500" /> Daily Wellness Tips
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WELLNESS_TIPS.map(tip => (
            <div key={tip.title} className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{tip.icon}</span>
                <h3 className="font-semibold text-gray-900">{tip.title}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default WellnessPage;