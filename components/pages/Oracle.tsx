'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronUp, ChevronDown, Unlock } from 'lucide-react';

export default function OraclePage() {
  const [cgpa, setCgpa] = useState(7.5);
  const [gre, setGre] = useState(310);
  const [workEx, setWorkEx] = useState<'0-1' | '1-2' | '2-3' | '3+'>('1-2');
  const [publications, setPublications] = useState(2);
  const [sopQuality, setSopQuality] = useState(4);
  const [targetProgram, setTargetProgram] = useState('ms-cs');

  // Calculate admit probability based on inputs
  const calculateAdmitProbability = () => {
    let base = 50;
    base += (cgpa / 10) * 15;
    base += (gre - 260) * 0.25;
    base += publications * 3;
    base += sopQuality * 2;
    return Math.min(99, Math.max(30, Math.round(base)));
  };

  const admitProb = calculateAdmitProbability();

  // Determine probability tier color
  const getProbColor = (prob: number) => {
    if (prob < 40) return '#ef4444';
    if (prob < 60) return '#f59e0b';
    return '#10b981';
  };

  const gapAnalysis = [
    { factor: 'Publications & Research', improvement: '+12%', icon: '📚' },
    { factor: 'GRE Quant Score', improvement: '+8%', icon: '🧮' },
    { factor: 'Work Experience', improvement: '+5%', icon: '💼' },
  ];

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#fafaf9]">
      {/* Left Panel - Inputs */}
      <div className="w-[42%] bg-[#fafaf9] p-8 overflow-y-auto border-r border-[#e5e7eb]">
        <h1 className="text-3xl font-serif font-bold text-[#111118] mb-8">Your Profile</h1>

        {/* CGPA Slider */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#111118] mb-3 flex justify-between">
            <span>CGPA</span>
            <span className="text-[#6d28d9] font-serif text-lg">{cgpa.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={cgpa}
            onChange={(e) => setCgpa(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#e5e7eb] rounded-full appearance-none cursor-pointer accent-[#6d28d9]"
          />
          <div className="flex justify-between text-xs text-[#6b7280] mt-2">
            <span>0</span>
            <span>10</span>
          </div>
        </div>

        {/* GRE Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#111118] mb-3">GRE Score</label>
          <input
            type="number"
            min="260"
            max="340"
            value={gre}
            onChange={(e) => setGre(parseInt(e.target.value))}
            className="w-full bg-white border border-[#ddd] rounded-lg px-4 py-3 text-[#111118] focus:outline-none focus:ring-2 focus:ring-[#6d28d9]"
          />
          <div className="flex justify-between text-xs text-[#6b7280] mt-2">
            <span>260</span>
            <span>340</span>
          </div>
        </div>

        {/* Work Experience Segmented Control */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#111118] mb-3">Work Experience</label>
          <div className="flex gap-2 bg-[#f3f1f5] p-1 rounded-lg">
            {(['0-1', '1-2', '2-3', '3+'] as const).map(option => (
              <button
                key={option}
                onClick={() => setWorkEx(option)}
                className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${
                  workEx === option
                    ? 'bg-[#6d28d9] text-white'
                    : 'text-[#111118] hover:text-[#6d28d9]'
                }`}
              >
                {option}y
              </button>
            ))}
          </div>
        </div>

        {/* Publications Stepper */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#111118] mb-3 flex justify-between">
            <span>Publications</span>
            <span className="text-[#6d28d9] font-serif text-lg">{publications}</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setPublications(Math.max(0, publications - 1))}
              className="flex-1 bg-[#f3f1f5] hover:bg-[#e5e7eb] border border-[#ddd] rounded-lg py-2 flex items-center justify-center transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-[#6b7280]" />
            </button>
            <button
              onClick={() => setPublications(publications + 1)}
              className="flex-1 bg-[#f3f1f5] hover:bg-[#e5e7eb] border border-[#ddd] rounded-lg py-2 flex items-center justify-center transition-colors"
            >
              <ChevronUp className="w-4 h-4 text-[#6b7280]" />
            </button>
          </div>
        </div>

        {/* SOP Quality Rating */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#111118] mb-3">SOP Quality</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setSopQuality(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className="w-6 h-6"
                  fill={star <= sopQuality ? '#f59e0b' : '#e5e7eb'}
                  color={star <= sopQuality ? '#f59e0b' : '#d1d5db'}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Target Program Dropdown */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#111118] mb-3">Target Program</label>
          <select
            value={targetProgram}
            onChange={(e) => setTargetProgram(e.target.value)}
            className="w-full bg-white border border-[#ddd] rounded-lg px-4 py-3 text-[#111118] focus:outline-none focus:ring-2 focus:ring-[#6d28d9]"
          >
            <option value="ms-cs">MS Computer Science</option>
            <option value="ms-ae">MS Analytics & Engineering</option>
            <option value="mba">MBA</option>
            <option value="ms-data">MS Data Science</option>
          </select>
        </div>
      </div>

      {/* Right Panel - Output */}
      <div className="w-[58%] bg-[#fafaf9] p-8 overflow-y-auto flex flex-col">
        {/* Admit Probability Arc */}
        <motion.div
          className="bg-white rounded-2xl p-8 mb-8 text-center border border-[#e5e7eb]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-[#6b7280] text-sm uppercase tracking-wide mb-4">Admission Probability</p>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={getProbColor(admitProb)}
                  strokeWidth="8"
                  strokeDasharray={`${(admitProb / 100) * 314} 314`}
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 314' }}
                  animate={{ strokeDasharray: `${(admitProb / 100) * 314} 314` }}
                  transition={{ duration: 0.8 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-serif font-bold" style={{ color: getProbColor(admitProb) }}>
                    {admitProb}%
                  </p>
                  <p className="text-xs text-[#6b7280] mt-1">Likely Range</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#6b7280]">
            {admitProb >= 70 ? 'Excellent chances!' : admitProb >= 50 ? 'Competitive profile' : 'Improve key metrics'}
          </p>
        </motion.div>

        {/* Gap Analysis */}
        <div className="mb-8">
          <h3 className="text-lg font-serif font-bold text-[#111118] mb-4">Gap Analysis</h3>
          <div className="space-y-3">
            {gapAnalysis.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-[#e5e7eb] rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[#111118] font-medium">{item.factor}</span>
                </div>
                <div className="bg-[#f59e0b]/10 text-[#f59e0b] px-3 py-1 rounded-full font-medium text-sm">
                  {item.improvement}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Funding Readiness */}
        <motion.div
          className="bg-gradient-to-br from-[#6d28d9] to-[#8b5cf6] rounded-2xl p-6 text-white border border-[#8b5cf6]/30 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <p className="text-sm opacity-90 mb-1">Funding Readiness</p>
            <p className="font-serif font-bold text-xl">
              {admitProb > 60 ? 'Unlocked' : 'Locked'}
            </p>
          </div>
          {admitProb > 60 ? (
            <Unlock className="w-8 h-8" />
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
              <span className="text-xs">-</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
