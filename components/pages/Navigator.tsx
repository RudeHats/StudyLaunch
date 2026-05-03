'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send, Zap, TrendingUp, Award } from 'lucide-react';

export default function NavigatorPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    { role: 'ai', content: 'Hello Arjun! I\'ve analyzed your profile. Let me show you the best programs matched to your profile, financial situation, and career goals.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showMatches, setShowMatches] = useState(true);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { role: 'user', content: inputValue }]);
      setInputValue('');
      setShowMatches(true);
    }
  };

  const programMatches = [
    { initials: 'MIT', roi: 8.5, admit: 42, loan: '₹28L' },
    { initials: 'CMU', roi: 8.2, admit: 55, loan: '₹25L' },
    { initials: 'UMich', roi: 7.9, admit: 68, loan: '₹22L' },
  ];

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#fafaf9]">
      {/* Left Panel - Profile */}
      <div className="w-[38%] bg-[#0f0a2e] border-r border-[#1a1145] p-6 overflow-y-auto flex flex-col">
        {/* Avatar & Name */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6d28d9] to-[#8b5cf6] flex items-center justify-center">
            <span className="text-white text-2xl font-serif font-bold">AP</span>
          </div>
          <div>
            <h2 className="text-white text-xl font-serif font-bold">Arjun Patel</h2>
            <p className="text-[#8b5cf6] text-sm">Student Profile</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-[#1a1145] rounded-2xl p-6 mb-8 border border-[#6d28d9]/20">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[#6b7280] text-xs uppercase tracking-wide mb-1">GPA</p>
              <p className="text-white text-3xl font-serif font-bold">8.4</p>
            </div>
            <div>
              <p className="text-[#6b7280] text-xs uppercase tracking-wide mb-1">GRE</p>
              <p className="text-white text-3xl font-serif font-bold">310</p>
            </div>
            <div>
              <p className="text-[#6b7280] text-xs uppercase tracking-wide mb-1">Target</p>
              <p className="text-white text-lg font-medium">USA</p>
            </div>
            <div>
              <p className="text-[#6b7280] text-xs uppercase tracking-wide mb-1">Work Ex</p>
              <p className="text-white text-lg font-medium">2.5 yrs</p>
            </div>
          </div>
        </div>

        {/* Profile Completeness */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[#1a1145] rounded-full h-3 overflow-hidden">
            <div className="bg-[#f59e0b] h-full w-[82%] transition-all duration-500"></div>
          </div>
          <span className="text-[#f59e0b] text-sm font-medium">82%</span>
        </div>
        <p className="text-[#8b5cf6] text-xs mt-2">Profile Completeness</p>
      </div>

      {/* Right Panel - Chat */}
      <div className="w-[62%] bg-[#fafaf9] p-6 flex flex-col">
        {/* File Upload Zone */}
        <div className="border-2 border-dashed border-[#6d28d9]/30 rounded-xl p-4 mb-6 bg-[#fafaf9] hover:bg-[#f3f1f5] transition-colors cursor-pointer">
          <div className="flex items-center justify-center gap-2 text-[#6b7280]">
            <Upload className="w-5 h-5" />
            <span className="text-sm">Drop documents to analyze or upload new ones</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-[#6d28d9] text-white rounded-br-none'
                  : 'bg-white border border-[#ddd] text-[#111118] rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Program Matches */}
          {showMatches && messages[messages.length - 1]?.role === 'ai' && (
            <div className="mt-6">
              <p className="text-[#6b7280] text-sm font-medium mb-3">Program Matches</p>
              <div className="space-y-3">
                {programMatches.map((prog, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border border-[#ddd] rounded-xl p-4 flex items-start justify-between hover:shadow-lg transition-shadow"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[#6d28d9]/10 flex items-center justify-center">
                          <span className="text-[#6d28d9] font-serif font-bold text-sm">{prog.initials}</span>
                        </div>
                        <div>
                          <p className="font-medium text-[#111118]">{prog.initials}</p>
                          <p className="text-xs text-[#6b7280]">ROI Score: {prog.roi}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#6b7280] mb-2">Admit Prob.</div>
                      <div className="w-20 h-1 bg-[#e5e7eb] rounded-full overflow-hidden">
                        <div className="h-full bg-[#10b981]" style={{ width: `${prog.admit}%` }}></div>
                      </div>
                      <p className="text-sm font-medium text-[#111118] mt-2">{prog.admit}%</p>
                      <div className="bg-[#f59e0b]/10 text-[#f59e0b] text-xs px-2 py-1 rounded-full mt-2 inline-block font-medium">
                        Est. loan: {prog.loan}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-3 pt-4 border-t border-[#e5e7eb]">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your programs, funding options, or next steps..."
            className="flex-1 bg-[#f3f1f5] border border-[#ddd] rounded-xl px-4 py-3 text-[#111118] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#6d28d9] transition-all"
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#6d28d9] hover:bg-[#8b5cf6] text-white p-3 rounded-xl transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
