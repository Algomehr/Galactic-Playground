
import React, { useState } from 'react';
import type { CustomPlanetParams } from '../types';

interface PlanetCreatorProps {
  onGenerate: (params: CustomPlanetParams) => void;
}

const InputField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }> = 
  ({ label, id, value, onChange, required }) => (
    <div>
      <label htmlFor={id} className="block mb-2 text-lg font-medium text-gray-300 font-display">{label}{required && ' *'}</label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-gray-700 border-2 border-gray-600 text-white text-base rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-3"
      />
    </div>
);

const SelectField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = 
  ({ label, id, value, onChange, children }) => (
    <div>
      <label htmlFor={id} className="block mb-2 text-lg font-medium text-gray-300 font-display">{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="bg-gray-700 border-2 border-gray-600 text-white text-base rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-3"
      >
        {children}
      </select>
    </div>
);

const TextAreaField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = 
  ({ label, id, value, onChange, rows = 3 }) => (
    <div>
      <label htmlFor={id} className="block mb-2 text-lg font-medium text-gray-300 font-display">{label}</label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        className="bg-gray-700 border-2 border-gray-600 text-white text-base rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-3"
      ></textarea>
    </div>
);


const PlanetCreator: React.FC<PlanetCreatorProps> = ({ onGenerate }) => {
  const [params, setParams] = useState<CustomPlanetParams>({
    name: '',
    planetType: 'سنگی و خاکی',
    distanceFromStar: 'گرم و خوب',
    atmosphere: 'پر از اکسیژن برای نفس کشیدن',
    gravity: 'مثل زمین',
    waterPresence: 'پر از اقیانوس‌های آبی',
    resources: '',
    description: '',
    starType: 'یک خورشید زرد و درخشان',
    systemLayout: 'مدار گرد و آروم',
    galacticNeighborhood: 'یک گوشه دنج و آروم کهکشان',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setParams({ ...params, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (params.name.trim() === '') {
      setError('هر سیاره‌ای یک اسم قشنگ لازم داره!');
      return;
    }
    setError('');
    onGenerate(params);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-800/70 rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            آزمایشگاه جادویی سیاره‌سازی
          </h1>
          <p className="text-gray-300 mt-2">سیاره رویایی خودت رو بساز تا ببینیم چه موجودات عجیبی می‌تونن اونجا زندگی کنن!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField label="یک اسم برای سیاره‌ات انتخاب کن" id="name" value={params.name} onChange={handleChange} required />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField label="جنس سیاره‌ات چیه؟" id="planetType" value={params.planetType} onChange={handleChange}>
              <option>سنگی و خاکی</option>
              <option>گازی و پفکی</option>
              <option>یخی و سرد</option>
              <option>پر از آب</option>
              <option>آتشفشانی و داغ</option>
            </SelectField>

            <SelectField label="چقدر به خورشیدش نزدیکه؟" id="distanceFromStar" value={params.distanceFromStar} onChange={handleChange}>
                <option>خیلی نزدیک و داغ!</option>
                <option>گرم و خوب</option>
                <option>دور و سرد</option>
            </SelectField>

            <SelectField label="هواش چطوره؟" id="atmosphere" value={params.atmosphere} onChange={handleChange}>
                <option>پر از اکسیژن برای نفس کشیدن</option>
                <option>ابرهای سمی و بدبو</option>
                <option>هوای خیلی کم</option>
                <option>بدون هوا</option>
            </SelectField>
            
            <SelectField label="چقدر می‌تونی بالا بپری؟" id="gravity" value={params.gravity} onChange={handleChange}>
                <option>خیلی زیاد (مثل ماه)</option>
                <option>مثل زمین</option>
                <option>به سختی (خیلی سنگین)</option>
            </SelectField>
            
            <SelectField label="آب هم داره؟" id="waterPresence" value={params.waterPresence} onChange={handleChange}>
              <option>پر از اقیانوس‌های آبی</option>
              <option>یخ‌های قطبی</option>
              <option>فقط بخار آب توی هوا</option>
              <option>هیچی آب نداره</option>
            </SelectField>

            <SelectField label="خورشیدش چه شکلیه؟" id="starType" value={params.starType} onChange={handleChange}>
                <option>یک خورشید زرد و درخشان</option>
                <option>یک کوتوله قرمز کوچولو</option>
                <option>یک غول آبی بزرگ</option>
            </SelectField>
          </div>
          
          <InputField label="چه گنج‌هایی اونجا پیدا میشه؟ (مثلا: شکلات، الماس)" id="resources" value={params.resources} onChange={handleChange} />
          <TextAreaField label="یه چیز جالب دیگه در موردش بگو" id="description" value={params.description} onChange={handleChange} />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button type="submit" className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white font-bold py-4 px-4 rounded-full text-2xl transition-all duration-300 transform hover:scale-105 font-display">
            سیاره من رو بساز!
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlanetCreator;
