'use client';

import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChevronDown, Download, Share2, Search, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  program: string;
  status: 'applied' | 'admitted' | 'rejected' | 'funded';
  loanAmount: number;
  approvalDate: string;
  admitProbability: number;
  fundingAmount: number;
}

interface KPIData {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Arjun Patel',
    email: 'arjun@university.com',
    university: 'MIT',
    program: 'MS Computer Science',
    status: 'funded',
    loanAmount: 2500000,
    approvalDate: '2024-05-10',
    admitProbability: 92,
    fundingAmount: 1800000,
  },
  {
    id: '2',
    name: 'Priya Singh',
    email: 'priya@university.com',
    university: 'Stanford',
    program: 'MBA',
    status: 'admitted',
    loanAmount: 3200000,
    approvalDate: '2024-04-28',
    admitProbability: 85,
    fundingAmount: 0,
  },
  {
    id: '3',
    name: 'Rahul Kumar',
    email: 'rahul@university.com',
    university: 'Harvard',
    program: 'MS Statistics',
    status: 'applied',
    loanAmount: 2100000,
    approvalDate: '2024-06-01',
    admitProbability: 78,
    fundingAmount: 0,
  },
  {
    id: '4',
    name: 'Neha Gupta',
    email: 'neha@university.com',
    university: 'Yale',
    program: 'MS Engineering',
    status: 'funded',
    loanAmount: 2800000,
    approvalDate: '2024-05-15',
    admitProbability: 88,
    fundingAmount: 2100000,
  },
  {
    id: '5',
    name: 'Vikram Sharma',
    email: 'vikram@university.com',
    university: 'Berkeley',
    program: 'PhD Physics',
    status: 'admitted',
    loanAmount: 1900000,
    approvalDate: '2024-04-05',
    admitProbability: 95,
    fundingAmount: 0,
  },
];

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<'student' | 'admin'>('student');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const applicationTimeline = [
    { month: 'Jan', applied: 12, admitted: 3, funded: 1 },
    { month: 'Feb', applied: 18, admitted: 7, funded: 3 },
    { month: 'Mar', applied: 25, admitted: 12, funded: 6 },
    { month: 'Apr', applied: 32, admitted: 18, funded: 10 },
    { month: 'May', applied: 38, admitted: 24, funded: 16 },
    { month: 'Jun', applied: 45, admitted: 28, funded: 22 },
  ];

  const statusDistribution = [
    { name: 'Applied', value: 23, fill: '#3b82f6' },
    { name: 'Admitted', value: 16, fill: '#10b981' },
    { name: 'Rejected', value: 6, fill: '#ef4444' },
    { name: 'Funded', value: 22, fill: '#6d28d9' },
  ];

  const filteredStudents = useMemo(() => {
    return mockStudents.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.university.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !filterStatus || student.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filterStatus]);

  const kpiData: KPIData[] = [
    {
      label: 'Total Applications',
      value: 45,
      change: 12,
      icon: <Users size={20} />,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      label: 'Admission Rate',
      value: '62%',
      change: 8,
      icon: <CheckCircle size={20} />,
      color: 'bg-green-50 text-green-600 border-green-200',
    },
    {
      label: 'Funded Students',
      value: 22,
      change: 15,
      icon: <TrendingUp size={20} />,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      label: 'Avg. Processing Time',
      value: '18 days',
      change: -5,
      icon: <Clock size={20} />,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
    },
  ];

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    applied: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    admitted: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    funded: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };

  return (
    <div className="h-full overflow-y-auto bg-[#fafaf9] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#111118] mb-2">Dashboard</h1>
            <p className="text-[#6b7280]">Track applications, admissions, and funding status</p>
          </div>
          <div className="flex items-center gap-3">
            <ToggleGroup value={viewMode} onValueChange={(val) => val && setViewMode(val as 'student' | 'admin')} type="single">
              <ToggleGroupItem value="student" aria-label="Student View">
                Student View
              </ToggleGroupItem>
              <ToggleGroupItem value="admin" aria-label="Admin View">
                Admin View
              </ToggleGroupItem>
            </ToggleGroup>
            <Button variant="outline" size="sm" className="flex gap-2">
              <Download size={16} /> Export
            </Button>
            <Button variant="outline" size="sm" className="flex gap-2">
              <Share2 size={16} /> Share
            </Button>
          </div>
        </div>

        {/* Student View */}
        {viewMode === 'student' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {kpiData.map((kpi, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <Card className={`p-4 border-2 ${kpi.color}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${kpi.color}`}>{kpi.icon}</div>
                      <Badge variant="secondary" className={`${kpi.change > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        {kpi.change > 0 ? '+' : ''}{kpi.change}%
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6b7280] mb-1">{kpi.label}</p>
                    <p className="font-serif text-2xl font-bold text-[#111118]">{kpi.value}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Application Timeline */}
              <Card className="lg:col-span-2 p-6">
                <h3 className="font-serif text-lg font-bold text-[#111118] mb-4">Application Progress</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={applicationTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="applied" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="admitted" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="funded" stroke="#6d28d9" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Status Distribution */}
              <Card className="p-6">
                <h3 className="font-serif text-lg font-bold text-[#111118] mb-4">Status Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statusDistribution} cx="50%" cy="50%" outerRadius={80} paddingAngle={2} dataKey="value">
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Portfolio Summary */}
            <Card className="p-6">
              <h3 className="font-serif text-lg font-bold text-[#111118] mb-4">Your Applications</h3>
              <div className="space-y-3">
                {mockStudents.slice(0, 2).map((student, idx) => (
                  <motion.div key={student.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                    <Card className="p-4 border-[#e5e7eb]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-serif font-bold text-[#111118]">{student.program}</h4>
                            <Badge className={statusColors[student.status].bg + ' ' + statusColors[student.status].text + ' border ' + statusColors[student.status].border}>
                              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#6b7280] mb-3">{student.university}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-[#9ca3af] text-xs">Admit Probability</p>
                              <p className="font-serif font-bold text-[#111118]">{student.admitProbability}%</p>
                            </div>
                            <div>
                              <p className="text-[#9ca3af] text-xs">Loan Requested</p>
                              <p className="font-serif font-bold text-[#111118]">₹{(student.loanAmount / 100000).toFixed(1)}L</p>
                            </div>
                            {student.fundingAmount > 0 && (
                              <div>
                                <p className="text-[#9ca3af] text-xs">Approved</p>
                                <p className="font-serif font-bold text-green-600">₹{(student.fundingAmount / 100000).toFixed(1)}L</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-[#6b7280] transition-transform cursor-pointer ${expandedStudent === student.id ? 'rotate-180' : ''}`}
                          onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                        />
                      </div>

                      {expandedStudent === student.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-[#e5e7eb]">
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-[#9ca3af] mb-1">Applied On</p>
                              <p className="font-serif font-bold text-[#111118]">{student.approvalDate}</p>
                            </div>
                            <div>
                              <p className="text-[#9ca3af] mb-1">Email</p>
                              <p className="font-serif font-bold text-[#111118] text-xs">{student.email}</p>
                            </div>
                          </div>
                          <Button className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white">View Full Application</Button>
                        </motion.div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Admin View */}
        {viewMode === 'admin' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {/* Search & Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-3 text-[#9ca3af]" />
                <Input
                  placeholder="Search by name or university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#e5e7eb]"
                />
              </div>
              <ToggleGroup value={filterStatus || ''} onValueChange={(val) => setFilterStatus(val || null)} type="single">
                <ToggleGroupItem value="" aria-label="All">All</ToggleGroupItem>
                <ToggleGroupItem value="applied" aria-label="Applied">Applied</ToggleGroupItem>
                <ToggleGroupItem value="admitted" aria-label="Admitted">Admitted</ToggleGroupItem>
                <ToggleGroupItem value="funded" aria-label="Funded">Funded</ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Students Table */}
            <Card className="p-6">
              <h3 className="font-serif text-lg font-bold text-[#111118] mb-4">All Students ({filteredStudents.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-[#e5e7eb]">
                    <tr>
                      <th className="text-left py-3 px-4 font-serif font-bold text-[#111118] text-sm">Student</th>
                      <th className="text-left py-3 px-4 font-serif font-bold text-[#111118] text-sm">University</th>
                      <th className="text-left py-3 px-4 font-serif font-bold text-[#111118] text-sm">Program</th>
                      <th className="text-left py-3 px-4 font-serif font-bold text-[#111118] text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-serif font-bold text-[#111118] text-sm">Loan Amount</th>
                      <th className="text-left py-3 px-4 font-serif font-bold text-[#111118] text-sm">Funded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <motion.tr key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#6d28d9] to-[#f59e0b] rounded-full flex items-center justify-center text-white font-serif font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-serif font-bold text-[#111118] text-sm">{student.name}</p>
                              <p className="text-xs text-[#9ca3af]">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#6b7280]">{student.university}</td>
                        <td className="py-3 px-4 text-sm text-[#6b7280]">{student.program}</td>
                        <td className="py-3 px-4">
                          <Badge className={statusColors[student.status].bg + ' ' + statusColors[student.status].text + ' border ' + statusColors[student.status].border + ' text-xs'}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-serif font-bold text-[#111118] text-sm">₹{(student.loanAmount / 100000).toFixed(1)}L</td>
                        <td className="py-3 px-4">
                          <span className={`font-serif font-bold text-sm ${student.fundingAmount > 0 ? 'text-green-600' : 'text-[#9ca3af]'}`}>
                            {student.fundingAmount > 0 ? `₹${(student.fundingAmount / 100000).toFixed(1)}L` : '—'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
