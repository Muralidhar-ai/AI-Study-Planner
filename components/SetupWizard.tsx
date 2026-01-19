
import React, { useState } from 'react';
import { Subject, SubjectType } from '../types';
import { ArrowLeft, ArrowRight, Save, Info } from 'lucide-react';

interface SetupWizardProps {
  onAdd: (subject: Subject) => void;
  onCancel: () => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onAdd, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    totalUnits: 5,
    examDate: '',
    subjectType: 'General' as SubjectType,
    difficulty: 5
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.examDate) {
      alert("Please fill in all fields.");
      return;
    }
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: formData.name,
      totalUnits: Number(formData.totalUnits),
      examDate: formData.examDate,
      subjectType: formData.subjectType,
      difficulty: formData.difficulty,
      completedUnits: 0
    };
    onAdd(newSubject);
  };

  const types: SubjectType[] = ['Engineering', 'Arts', 'Medical', 'General'];

  return (
    <div className="max-w-xl mx-auto glass-card rounded-2xl shadow-2xl p-8 bg-white dark:bg-gray-800">
      
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                {s}
             </div>
             {s < 3 && <div className={`h-1 flex-1 mx-2 ${step > s ? 'bg-indigo-600' : 'bg-gray-100 dark:bg-gray-700'}`}></div>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="min-h-[300px] flex flex-col">
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Subject Name</label>
              <input 
                autoFocus
                type="text" 
                placeholder="e.g. Quantum Physics"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Category</label>
              <div className="grid grid-cols-2 gap-3">
                {types.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({...formData, subjectType: t})}
                    className={`
                      py-3 rounded-xl border-2 font-medium text-sm transition-all
                      ${formData.subjectType === t 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                        : 'border-gray-100 dark:border-gray-700 text-gray-500'}
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Total Units / Chapters</label>
              <input 
                type="number" 
                min="1"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.totalUnits}
                onChange={(e) => setFormData({...formData, totalUnits: parseInt(e.target.value)})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Exam Date</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.examDate}
                onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                required
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                Difficulty Level ({formData.difficulty}/10)
              </label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: parseInt(e.target.value)})}
              />
              <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 uppercase">
                 <span>Beginner</span>
                 <span>Intermediate</span>
                 <span>Hardcore</span>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 flex gap-4">
               <Info className="text-amber-600 shrink-0" size={20} />
               <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                 We'll allocate more time for subjects with higher difficulty and adjust logic based on your {formData.subjectType} focus.
               </p>
            </div>
          </div>
        )}

        <div className="mt-auto pt-8 flex items-center justify-between">
          {step > 1 ? (
            <button 
              type="button" 
              onClick={prevStep}
              className="flex items-center gap-2 text-gray-500 font-bold hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft size={18} /> Back
            </button>
          ) : (
            <button 
              type="button" 
              onClick={onCancel}
              className="text-gray-400 font-bold hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button 
              type="button" 
              onClick={nextStep}
              className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all"
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button 
              type="submit"
              className="flex items-center gap-2 bg-teal-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-200 dark:shadow-none hover:bg-teal-600 transition-all"
            >
              Create Schedule <Save size={18} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SetupWizard;
