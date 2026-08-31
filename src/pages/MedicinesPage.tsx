import React, { useState } from 'react';
import { Pill, Plus, Clock, Trash2, Bell, BellOff, Check, X, Calendar, Search, AlertCircle } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
  startDate: string;
  endDate?: string;
  notes: string;
  reminderEnabled: boolean;
  taken: boolean[];
}

const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Every 8 hours', 'Every 6 hours', 'As needed', 'Weekly'];

const COMMON_MEDICINES = [
  'Paracetamol 500mg', 'Metformin 500mg', 'Amlodipine 5mg', 'Atorvastatin 10mg',
  'Omeprazole 20mg', 'Cetirizine 10mg', 'Aspirin 75mg', 'Vitamin D3 1000IU',
  'Calcium Carbonate 500mg', 'Lisinopril 5mg'
];

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      dosage: '1 tablet',
      frequency: 'Twice daily',
      time: ['08:00', '20:00'],
      startDate: new Date().toISOString().split('T')[0],
      notes: 'Take after meals',
      reminderEnabled: true,
      taken: [false, false]
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    time: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
    reminderEnabled: true,
  });
  const [suggestion, setSuggestion] = useState('');

  const getTimesForFrequency = (freq: string): string[] => {
    switch (freq) {
      case 'Once daily': return ['08:00'];
      case 'Twice daily': return ['08:00', '20:00'];
      case 'Three times daily': return ['08:00', '14:00', '20:00'];
      case 'Every 8 hours': return ['08:00', '16:00', '00:00'];
      case 'Every 6 hours': return ['06:00', '12:00', '18:00', '00:00'];
      case 'Weekly': return ['08:00'];
      default: return ['08:00'];
    }
  };

  const handleFrequencyChange = (freq: string) => {
    setForm(prev => ({ ...prev, frequency: freq, time: getTimesForFrequency(freq) }));
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.dosage.trim()) return;

    const newMed: Medicine = {
      id: Date.now().toString(),
      name: form.name.trim(),
      dosage: form.dosage.trim(),
      frequency: form.frequency,
      time: form.time,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      notes: form.notes.trim(),
      reminderEnabled: form.reminderEnabled,
      taken: new Array(form.time.length).fill(false),
    };

    setMedicines(prev => [newMed, ...prev]);
    setForm({
      name: '', dosage: '', frequency: 'Once daily',
      time: ['08:00'], startDate: new Date().toISOString().split('T')[0],
      endDate: '', notes: '', reminderEnabled: true,
    });
    setShowAddForm(false);
    setSuggestion('');
  };

  const toggleTaken = (medId: string, timeIndex: number) => {
    setMedicines(prev => prev.map(m => {
      if (m.id !== medId) return m;
      const taken = [...m.taken];
      taken[timeIndex] = !taken[timeIndex];
      return { ...m, taken };
    }));
  };

  const toggleReminder = (medId: string) => {
    setMedicines(prev => prev.map(m =>
      m.id === medId ? { ...m, reminderEnabled: !m.reminderEnabled } : m
    ));
  };

  const deleteMedicine = (medId: string) => {
    setMedicines(prev => prev.filter(m => m.id !== medId));
  };

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.dosage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayProgress = medicines.reduce((acc, m) => {
    const taken = m.taken.filter(Boolean).length;
    return { taken: acc.taken + taken, total: acc.total + m.time.length };
  }, { taken: 0, total: 0 });

  const adherencePercent = todayProgress.total > 0
    ? Math.round((todayProgress.taken / todayProgress.total) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Pill className="h-8 w-8 text-indigo-600" />
            My Medicines
          </h1>
          <p className="text-gray-600 mt-1">Track and manage your medications</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
          id="add-medicine-btn"
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAddForm ? 'Cancel' : 'Add Medicine'}
        </button>
      </div>

      {/* Today's Adherence Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white col-span-1 md:col-span-1">
          <p className="text-white/80 text-sm font-medium mb-1">Today's Adherence</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">{adherencePercent}%</span>
            <span className="text-white/70 text-sm mb-1">({todayProgress.taken}/{todayProgress.total} doses)</span>
          </div>
          <div className="mt-3 bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${adherencePercent}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <p className="text-gray-500 text-sm font-medium mb-1">Active Medicines</p>
          <p className="text-4xl font-bold text-gray-900">{medicines.length}</p>
          <p className="text-gray-400 text-xs mt-1">Currently tracked</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <p className="text-gray-500 text-sm font-medium mb-1">Reminders Active</p>
          <p className="text-4xl font-bold text-indigo-600">{medicines.filter(m => m.reminderEnabled).length}</p>
          <p className="text-gray-400 text-xs mt-1">With notifications</p>
        </div>
      </div>

      {/* Add Medicine Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-600" />
            Add New Medicine
          </h2>
          <form onSubmit={handleAddMedicine} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => {
                    const val = e.target.value;
                    setForm(prev => ({ ...prev, name: val }));
                    const match = COMMON_MEDICINES.find(m => m.toLowerCase().startsWith(val.toLowerCase()) && val.length > 1);
                    setSuggestion(match && match !== val ? match : '');
                  }}
                  placeholder="e.g. Paracetamol 500mg"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                {suggestion && (
                  <button
                    type="button"
                    onClick={() => { setForm(prev => ({ ...prev, name: suggestion })); setSuggestion(''); }}
                    className="absolute left-4 top-[68px] text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 w-full text-left transition-colors"
                  >
                    💊 {suggestion}
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                <input
                  type="text"
                  value={form.dosage}
                  onChange={e => setForm(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g. 1 tablet, 5ml"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  value={form.frequency}
                  onChange={e => handleFrequencyChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
                <input
                  type="date"
                  value={form.endDate}
                  min={form.startDate}
                  onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Take after meals"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, reminderEnabled: !prev.reminderEnabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.reminderEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.reminderEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="text-sm text-gray-700">Enable reminders</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
              >
                <Check className="h-4 w-4" />
                Save Medicine
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search medicines..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
        </div>
      </div>

      {/* Medicine List */}
      {filteredMedicines.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
          <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No medicines tracked</h3>
          <p className="text-gray-500 mb-6">Add your first medicine to start tracking your medication schedule</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Medicine
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMedicines.map(med => {
            const allTaken = med.taken.every(Boolean);
            const someTaken = med.taken.some(Boolean);
            return (
              <div
                key={med.id}
                className={`bg-white rounded-2xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow duration-200 ${
                  allTaken ? 'border-green-200' : someTaken ? 'border-yellow-200' : 'border-gray-100'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${allTaken ? 'bg-green-100' : 'bg-indigo-50'}`}>
                        <Pill className={`h-6 w-6 ${allTaken ? 'text-green-600' : 'text-indigo-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-lg">{med.name}</h3>
                          {allTaken && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
                              <Check className="h-3 w-3" /> All taken
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-sm text-gray-600 font-medium">{med.dosage}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-indigo-600 font-medium">{med.frequency}</span>
                        </div>
                        {med.notes && (
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {med.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          Started {new Date(med.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {med.endDate && ` · Until ${new Date(med.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleReminder(med.id)}
                        title={med.reminderEnabled ? 'Disable reminder' : 'Enable reminder'}
                        className={`p-2 rounded-lg transition-colors ${med.reminderEnabled ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
                      >
                        {med.reminderEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => deleteMedicine(med.id)}
                        title="Remove medicine"
                        className="p-2 rounded-lg text-red-400 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dose Times */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Today's doses
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {med.time.map((t, i) => (
                        <button
                          key={i}
                          onClick={() => toggleTaken(med.id, i)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            med.taken[i]
                              ? 'bg-green-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                          }`}
                        >
                          {med.taken[i] ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">
          <strong>Reminder:</strong> Always follow your doctor's prescription. This tracker is for personal reference only and does not replace professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default MedicinesPage;