'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoanScenario {
  name: string;
  monthlyEMI: number;
  totalPayable: number;
  totalInterest: number;
  tenure: number;
}

export default function LoanSensePage() {
  const [totalCost, setTotalCost] = useState(25);
  const [familyContribution, setFamilyContribution] = useState(5);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(10);
  const [expandedScenario, setExpandedScenario] = useState<string | null>('standard');

  const loanAmount = Math.max(0, totalCost - familyContribution);

  const calculateEMI = (principal: number, rate: number, months: number) => {
    if (months === 0 || rate === 0) return principal / 12;
    const monthlyRate = rate / 100 / 12;
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    return numerator / denominator;
  };

  const scenarios: Record<string, LoanScenario> = useMemo(() => ({
    standard: {
      name: 'Standard',
      monthlyEMI: calculateEMI(loanAmount, interestRate, tenure * 12),
      totalPayable: calculateEMI(loanAmount, interestRate, tenure * 12) * tenure * 12,
      totalInterest: (calculateEMI(loanAmount, interestRate, tenure * 12) * tenure * 12) - loanAmount,
      tenure,
    },
    accelerated: {
      name: 'Accelerated Repayment',
      monthlyEMI: calculateEMI(loanAmount, interestRate, tenure * 12 * 0.75),
      totalPayable: calculateEMI(loanAmount, interestRate, tenure * 12 * 0.75) * tenure * 9,
      totalInterest: (calculateEMI(loanAmount, interestRate, tenure * 12 * 0.75) * tenure * 9) - loanAmount,
      tenure: tenure * 0.75,
    },
    flexible: {
      name: 'Flexible Payment',
      monthlyEMI: calculateEMI(loanAmount, interestRate * 1.2, tenure * 12 * 1.25),
      totalPayable: calculateEMI(loanAmount, interestRate * 1.2, tenure * 12 * 1.25) * tenure * 12.5,
      totalInterest: (calculateEMI(loanAmount, interestRate * 1.2, tenure * 12 * 1.25) * tenure * 12.5) - loanAmount,
      tenure: tenure * 1.25,
    },
  }), [loanAmount, interestRate, tenure]);

  const costBreakdown = [
    { name: 'Tuition', value: totalCost * 0.6, fill: '#6d28d9' },
    { name: 'Living Expenses', value: totalCost * 0.3, fill: '#f59e0b' },
    { name: 'Books & Materials', value: totalCost * 0.1, fill: '#ec4899' },
  ];

  const repaymentTimeline = useMemo(() => {
    const standard = scenarios.standard;
    const months = standard.tenure * 12;
    const data = [];
    let remainingPrincipal = loanAmount;
    
    for (let i = 0; i <= months; i += Math.ceil(months / 12)) {
      const monthlyPayment = standard.monthlyEMI;
      const interest = remainingPrincipal * (standard.totalInterest / (loanAmount * standard.tenure * 12));
      const principal = monthlyPayment - interest;
      remainingPrincipal = Math.max(0, remainingPrincipal - principal);
      
      data.push({
        month: `Y${Math.floor(i / 12)}`,
        remaining: Math.max(0, remainingPrincipal),
        paid: loanAmount - remainingPrincipal,
      });
    }
    return data;
  }, [loanAmount, scenarios]);

  const handleExport = () => {
    const data = `Meridian Loan Calculator Report\n\nLoan Details:\nTotal Cost: $${totalCost}L\nFamily Contribution: $${familyContribution}L\nLoan Amount: $${loanAmount}L\nInterest Rate: ${interestRate}%\n\nStandard Scenario:\nMonthly EMI: $${scenarios.standard.monthlyEMI.toFixed(2)}K\nTotal Payable: $${scenarios.standard.totalPayable.toFixed(0)}L\nTotal Interest: $${scenarios.standard.totalInterest.toFixed(0)}L`;
    
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loan-calculator-report.txt';
    a.click();
  };

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#111118] mb-2">LoanSense</h1>
            <p className="text-[#6b7280]">Intelligent loan calculator & financial planning</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="flex gap-2">
              <Download size={16} /> Export
            </Button>
            <Button variant="outline" size="sm" className="flex gap-2">
              <Share2 size={16} /> Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Calculator Controls */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="font-serif text-xl font-bold text-[#111118] mb-6">Calculator</h2>

              {/* Total Education Cost */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[#111118] mb-3">
                  Total Education Cost: <span className="font-serif text-lg text-[#6d28d9]">${totalCost}L</span>
                </label>
                <Slider value={[totalCost]} onValueChange={(val) => setTotalCost(val[0])} min={10} max={100} step={1} className="w-full" />
                <p className="text-xs text-[#9ca3af] mt-2">Includes tuition, living expenses, books</p>
              </div>

              {/* Family Contribution */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[#111118] mb-3">
                  Family Contribution: <span className="font-serif text-lg text-[#f59e0b]">${familyContribution}L</span>
                </label>
                <Slider value={[familyContribution]} onValueChange={(val) => setFamilyContribution(Math.min(val[0], totalCost))} min={0} max={totalCost} step={1} className="w-full" />
              </div>

              {/* Loan Amount Display */}
              <Card className="bg-[#f3e8ff] border-[#ddd6fe] p-4 mb-8">
                <p className="text-xs text-[#6b7280] uppercase tracking-wide mb-1">Loan Required</p>
                <p className="font-serif text-3xl font-bold text-[#6d28d9]">${loanAmount}L</p>
              </Card>

              {/* Interest Rate */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[#111118] mb-3">
                  Interest Rate: <span className="font-serif text-lg text-[#ef4444]">{interestRate.toFixed(1)}%</span>
                </label>
                <Slider value={[interestRate]} onValueChange={(val) => setInterestRate(val[0])} min={5} max={15} step={0.5} className="w-full" />
              </div>

              {/* Tenure */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[#111118] mb-3">
                  Loan Tenure: <span className="font-serif text-lg text-[#10b981]">{tenure} years</span>
                </label>
                <Slider value={[tenure]} onValueChange={(val) => setTenure(val[0])} min={5} max={20} step={1} className="w-full" />
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7280]">Monthly EMI (Standard)</span>
                  <span className="font-serif font-bold text-[#111118]">${scenarios.standard.monthlyEMI.toFixed(0)}K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7280]">Total Interest</span>
                  <span className="font-serif font-bold text-[#111118]">${scenarios.standard.totalInterest.toFixed(0)}L</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Panel: Visualizations */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-2 space-y-6">
            {/* Cost Breakdown */}
            <Card className="p-6">
              <h3 className="font-serif text-lg font-bold text-[#111118] mb-4">Cost Breakdown</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={costBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                        {costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${(value).toFixed(1)}L`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-3">
                  {costBreakdown.map((item, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#111118]">{item.name}</p>
                        <p className="text-xs text-[#9ca3af]">${item.value.toFixed(1)}L ({((item.value / totalCost) * 100).toFixed(0)}%)</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Repayment Timeline */}
            <Card className="p-6">
              <h3 className="font-serif text-lg font-bold text-[#111118] mb-4">Repayment Timeline</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={repaymentTimeline}>
                  <defs>
                    <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6d28d9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6d28d9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip formatter={(value) => `$${value.toFixed(0)}L`} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="remaining" stroke="#6d28d9" fillOpacity={1} fill="url(#colorRemaining)" name="Principal Remaining" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Loan Scenarios */}
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#111118]">Loan Scenarios</h3>
              {Object.entries(scenarios).map(([key, scenario]) => (
                <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card className={`p-4 cursor-pointer transition-all ${expandedScenario === key ? 'border-[#6d28d9] bg-[#f3e8ff]' : 'border-[#e5e7eb] hover:border-[#d1d5db]'}`} onClick={() => setExpandedScenario(expandedScenario === key ? null : key)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-serif font-bold text-[#111118] mb-1">{scenario.name}</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-[#9ca3af] text-xs">Monthly EMI</p>
                            <p className="font-serif font-bold text-[#111118]">${scenario.monthlyEMI.toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-[#9ca3af] text-xs">Total Payable</p>
                            <p className="font-serif font-bold text-[#111118]">${scenario.totalPayable.toFixed(0)}L</p>
                          </div>
                          <div>
                            <p className="text-[#9ca3af] text-xs">Total Interest</p>
                            <p className="font-serif font-bold text-[#111118]">${scenario.totalInterest.toFixed(0)}L</p>
                          </div>
                        </div>
                      </div>
                      <ChevronDown size={20} className={`text-[#6b7280] transition-transform ${expandedScenario === key ? 'rotate-180' : ''}`} />
                    </div>

                    {expandedScenario === key && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-[#e5e7eb]">
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-[#9ca3af] mb-1">Tenure</p>
                            <p className="font-serif font-bold text-[#111118]">{scenario.tenure.toFixed(1)} years</p>
                          </div>
                          <div>
                            <p className="text-[#9ca3af] mb-1">Total Months</p>
                            <p className="font-serif font-bold text-[#111118]">{Math.round(scenario.tenure * 12)} months</p>
                          </div>
                        </div>
                        <Button className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white">Select This Plan</Button>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
