import React, { useState } from 'react';
import { Users, Clock, DollarSign, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const MediVerseDashboard = () => {
  const patientFlowData = [
    { time: '08:00', patients: 12 },
    { time: '10:00', patients: 28 },
    { time: '12:00', patients: 45 },
    { time: '14:00', patients: 38 },
    { time: '16:00', patients: 30 },
    { time: '18:00', patients: 24 }
  ];

  const [departments, setDepartments] = useState([
    { name: 'Cardiology', value: 22, color: '#EF4444', active: true },
    { name: 'Emergency Medicine', value: 18, color: '#F59E0B', active: true },
    { name: 'Dermatology', value: 15, color: '#10B981', active: true },
    { name: 'Orthopedics', value: 12, color: '#3B82F6', active: true },
    { name: 'Pediatrics', value: 8, color: '#A855F7', active: true },
    { name: 'Internal Medicine', value: 10, color: '#EC4899', active: true },
    { name: 'Neurology', value: 5, color: '#8B5CF6', active: true },
    { name: 'Ophthalmology', value: 6, color: '#F97316', active: true },
    { name: 'Pulmonology', value: 4, color: '#14B8A6', active: true },
    { name: 'Psychiatry', value: 3, color: '#6366F1', active: true },
    { name: 'Family Medicine', value: 7, color: '#059669', active: true },
    { name: 'General Practitioner', value: 5, color: '#84CC16', active: true }
  ]);

  const commonDiseasesData = [
    { name: 'COVID-19', value: 45, color: '#10B981' },
    { name: 'Hypertension', value: 38, color: '#F59E0B' },
    { name: 'Diabetes', value: 32, color: '#EF4444' },
    { name: 'Asthma', value: 28, color: '#3B82F6' },
    { name: 'Migraine', value: 22, color: '#A855F7' }
  ];

  const toggleDepartment = (index) => {
    setDepartments(prev => prev.map((dept, i) => 
      i === index ? { ...dept, active: !dept.active } : dept
    ));
  };

  const activeDepartments = departments.filter(d => d.active);

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <span>â†—</span> +12%
            </span>
          </div>
          <p className="text-slate-600 text-sm mb-1">Patients Today</p>
          <h3 className="text-4xl font-bold text-slate-800">156</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
              Urgent
            </span>
          </div>
          <p className="text-slate-600 text-sm mb-1">Emergency Cases</p>
          <h3 className="text-4xl font-bold text-slate-800">8</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <span>â†—</span> +3%
            </span>
          </div>
          <p className="text-slate-600 text-sm mb-1">Active Doctors</p>
          <h3 className="text-4xl font-bold text-slate-800">24/30</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-amber-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <span>â†—</span> +18%
            </span>
          </div>
          <p className="text-slate-600 text-sm mb-1">Today's Revenue</p>
          <h3 className="text-4xl font-bold text-slate-800">125,000 EGP</h3>
        </div>
      </div>

      {/* Active Doctors Now */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Active Doctors Now
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 border border-amber-200 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-800">Dr. Mahmoud Khalid</h3>
                <p className="text-sm text-slate-600">Cardiology</p>
              </div>
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                Busy
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-1">Floor 3 - Room 305</p>
            <p className="text-sm font-medium text-slate-700">Current Patients: 3</p>
          </div>

          <div className="bg-blue-100 border border-green-200 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-800">Dr. Hasnaa Mohamed</h3>
                <p className="text-sm text-slate-600">Pediatrics</p>
              </div>
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                Available
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-1">Floor 2 - Room 201</p>
            <p className="text-sm font-medium text-slate-700">Current Patients: 0</p>
          </div>

          <div className="bg-blue-100 border border-amber-200 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-800">Dr.Nada</h3>
                <p className="text-sm text-slate-600">Emergency</p>
              </div>
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                Busy
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-1">Floor 1 - Room 105</p>
            <p className="text-sm font-medium text-slate-700">Current Patients: 5</p>
          </div>
        </div>
      </div>

      {/* Doctors on Long Shift */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Doctors on Long Shift
        </h2>
        <div className="space-y-3">
          <div className="bg-blue-100 border border-amber-100 rounded-xl p-4 flex justify-between items-center">
            <span className="font-medium text-slate-800">Dr. Mahmoud Khalid</span>
            <span className="px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-lg">
              10 hours
            </span>
          </div>
          <div className="bg-blue-100 border border-amber-100 rounded-xl p-4 flex justify-between items-center">
            <span className="font-medium text-slate-800">Dr. Mohamed Ali</span>
            <span className="px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-lg">
              8 hours
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Patient Flow Today</h2>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={patientFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="patients" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Department Distribution</h2>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={activeDepartments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activeDepartments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full mt-4">
              {departments.map((dept, index) => (
                <div 
                  key={index}
                  onClick={() => toggleDepartment(index)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition"
                >
                  <div 
                    className="w-3 h-3 rounded-sm flex-shrink-0" 
                    style={{ backgroundColor: dept.color }}
                  />
                  <span 
                    className={`text-xs ${dept.active ? 'text-slate-700' : 'text-slate-400 line-through'}`}
                  >
                    {dept.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Common Diseases</h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={commonDiseasesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {commonDiseasesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MediVerseDashboard;