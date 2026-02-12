import React, { useState } from 'react';
import { Trash2, Plus, X } from 'lucide-react';

const DoctorsManagement = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: 'Dr. Mahmoud Khalid',
      specialty: 'Cardiology',
      gender: 'Male',
      age: 23,
      status: 'Single',
      schedule: 'Sat-Wed, 8 AM - 4 PM',
      location: 'Floor 3 - Room 305',
      phone: '+20 106 260 0199',
      email: 'mahmoud.alkodousy@gmail.com',
      experience: '6 years',
      fee: '500 EGP',
      certifications: ['Board Certified', 'Masters in Cardiology'],
      languages: ['Arabic', 'English', 'French']
    },
    {
      id: 2,
      name: 'Dr. Fatima Hassan',
      specialty: 'Pediatrics',
      gender: 'Female',
      age: 35,
      status: 'Single',
      schedule: 'Sun-Thu, 9 AM - 5 PM',
      location: 'Floor 2 - Room 201',
      phone: '+20 111 234 5678',
      email: 'fatima.hassan@hospital.com',
      experience: '8 years',
      fee: '350 EGP',
      certifications: ['Pediatric Board', 'Child Care Certificate'],
      languages: ['Arabic', 'English']
    },
    {
      id: 3,
      name: 'Dr. Nada',
      specialty: 'Dermatology',
      gender: 'Female',
      age: 23,
      status: 'Married',
      schedule: 'Sat-Wed, 10 AM - 6 PM',
      location: 'Floor 2 - Room 205',
      phone: '+20 122 345 6789',
      email: 'nada@hospital.com',
      experience: '3 years',
      fee: '400 EGP',
      certifications: ['Dermatology Board', 'Cosmetic Procedures'],
      languages: ['Arabic', 'English', 'German']
    }
  ]);

  const [newDoctorForm, setNewDoctorForm] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: 'Male',
    dateOfBirth: '',
    maritalStatus: 'Single',
    specialization: '',
    workSchedule: '',
    floorNumber: '',
    roomNumber: '',
    phone: '',
    yearsOfExperience: '',
    consultationFee: '',
    certifications: '',
    languages: ''
  });

  const handleDeleteDoctor = (id) => {
    const doctor = doctors.find(doc => doc.id === id);
    setDoctorToDelete(doctor);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setDoctors(doctors.filter(doc => doc.id !== doctorToDelete.id));
    setShowDeleteModal(false);
    setDoctorToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDoctorToDelete(null);
  };

  const handleAddDoctor = () => {
    const newDoctor = {
      id: doctors.length + 1,
      name: newDoctorForm.fullName,
      specialty: newDoctorForm.specialization,
      gender: newDoctorForm.gender,
      age: newDoctorForm.dateOfBirth ? new Date().getFullYear() - new Date(newDoctorForm.dateOfBirth).getFullYear() : 0,
      status: newDoctorForm.maritalStatus,
      schedule: newDoctorForm.workSchedule,
      location: `Floor ${newDoctorForm.floorNumber} - Room ${newDoctorForm.roomNumber}`,
      phone: newDoctorForm.phone,
      email: newDoctorForm.email,
      experience: `${newDoctorForm.yearsOfExperience} years`,
      fee: `${newDoctorForm.consultationFee} EGP`,
      certifications: newDoctorForm.certifications.split(',').map(c => c.trim()).filter(c => c),
      languages: newDoctorForm.languages.split(',').map(l => l.trim()).filter(l => l)
    };
    setDoctors([...doctors, newDoctor]);
    setShowAddDoctorModal(false);
    setNewDoctorForm({
      fullName: '',
      email: '',
      password: '',
      gender: 'Male',
      dateOfBirth: '',
      maritalStatus: 'Single',
      specialization: '',
      workSchedule: '',
      floorNumber: '',
      roomNumber: '',
      phone: '',
      yearsOfExperience: '',
      consultationFee: '',
      certifications: '',
      languages: ''
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Doctors Management</h2>
        <button 
          onClick={() => setShowAddDoctorModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 transition shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add New Doctor
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-opacity-40 z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-auto mt-20 shadow-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-800">This page says</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-700 text-sm leading-relaxed">
                Are you sure you want to delete this doctor? This will deactivate their account.
              </p>
            </div>
            <div className="bg-slate-50 px-4 py-3 flex justify-end gap-3 border-t border-slate-200">
              <button
                onClick={confirmDelete}
                className="px-6 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition font-medium"
              >
                OK
              </button>
              <button
                onClick={cancelDelete}
                className="px-6 py-1.5 bg-slate-200 text-slate-700 text-sm rounded hover:bg-slate-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Doctor Modal */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
          <div className="bg-white rounded-lg w-full max-w-xl mx-4 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Add New Doctor</h2>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <form className="space-y-4">
                {/* Row 1: Full Name + Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Dr. John Doe"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={newDoctorForm.fullName}
                      onChange={(e) => setNewDoctorForm({...newDoctorForm, fullName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="doctor@hospital.com"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={newDoctorForm.email}
                      onChange={(e) => setNewDoctorForm({...newDoctorForm, email: e.target.value})}
                    />
                  </div>
                </div>

                {/* Row 2: Password + Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={newDoctorForm.password}
                      onChange={(e) => setNewDoctorForm({...newDoctorForm, password: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      value={newDoctorForm.gender}
                      onChange={(e) => setNewDoctorForm({...newDoctorForm, gender: e.target.value})}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Date of Birth + Marital Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      placeholder="mm/dd/yyyy"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={newDoctorForm.dateOfBirth}
                      onChange={(e) => setNewDoctorForm({...newDoctorForm, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Marital Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      value={newDoctorForm.maritalStatus}
                      onChange={(e) => setNewDoctorForm({...newDoctorForm, maritalStatus: e.target.value})}
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Specialization + Work Schedule */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Specialization <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      value={newDoctorForm.specialization}
                      onChange={(e) => setNewDoctorForm({...newDoctorForm, specialization: e.target.value})}
                    >
                      <option value="">-- Select Specialization --</option>
                      <option value="General Practitioner">General Practitioner</option>
                      <option value="Family Medicine">Family Medicine</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pulmonology">Pulmonology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Emergency Medicine">Emergency Medicine</option>
                      <option value="Ophthalmology">Ophthalmology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Internal Medicine">Internal Medicine</option>
                      <option value="Psychiatry">Psychiatry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Work Schedule
                    </label>
                    <input
                      type="text"
                      placeholder="Sat-Wed, 8 AM - 4 PM"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={newDoctorForm.workSchedule}
                      onChange={(e) => setNewDoctorForm({...newDoctorForm, workSchedule: e.target.value})}
                    />
                  </div>
                </div>

                {/* Row 5: Floor Number + Room Number */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Floor Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="2"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={newDoctorForm.floorNumber}
                      onChange={(e) => setNewDoctorForm({...newDoctorForm, floorNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Room Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="205"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={newDoctorForm.roomNumber}
                      onChange={(e) => setNewDoctorForm({...newDoctorForm, roomNumber: e.target.value})}
                    />
                  </div>
                </div>

                {/* Row 6: Phone + Years of Experience */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+20 100 123 4567"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={newDoctorForm.phone}
                      onChange={(e) => setNewDoctorForm({...newDoctorForm, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Years of Experience <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="10"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={newDoctorForm.yearsOfExperience}
                      onChange={(e) => setNewDoctorForm({...newDoctorForm, yearsOfExperience: e.target.value})}
                    />
                  </div>
                </div>

                {/* Row 7: Consultation Fee (Full Width) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Consultation Fee (EGP) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="500"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={newDoctorForm.consultationFee}
                    onChange={(e) => setNewDoctorForm({...newDoctorForm, consultationFee: e.target.value})}
                  />
                </div>

                {/* Row 8: Certifications (Full Width) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Certifications (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Board Certified, Masters in Medicine"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={newDoctorForm.certifications}
                    onChange={(e) => setNewDoctorForm({...newDoctorForm, certifications: e.target.value})}
                  />
                </div>

                {/* Row 9: Languages (Full Width) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Languages Spoken (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Arabic, English, French"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={newDoctorForm.languages}
                    onChange={(e) => setNewDoctorForm({...newDoctorForm, languages: e.target.value})}
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-white rounded-b-lg">
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="px-5 py-2 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDoctor}
                className="px-5 py-2 text-sm bg-slate-700 text-white rounded hover:bg-blue-800 transition font-medium"
              >
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      )}

     {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-2xl shadow-sm border-t-4 border-slate-600 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{doctor.name}</h3>
                  <p className="text-sky-600 font-medium">{doctor.specialty}</p>
                </div>
                <button 
                  onClick={() => handleDeleteDoctor(doctor.id)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="text-slate-500 w-24">Gender:</span>
                  <span className="text-slate-800 font-medium">{doctor.gender}</span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-24">Age:</span>
                  <span className="text-slate-800 font-medium">{doctor.age} years</span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-24">Status:</span>
                  <span className="text-slate-800 font-medium">{doctor.status}</span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-24">Schedule:</span>
                  <span className="text-slate-800 font-medium">{doctor.schedule}</span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-24">Location:</span>
                  <span className="text-slate-800 font-medium">{doctor.location}</span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-24">Phone:</span>
                  <span className="text-slate-800 font-medium">{doctor.phone}</span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-24">Email:</span>
                  <span className="text-slate-800 font-medium text-xs">{doctor.email}</span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-24">Experience:</span>
                  <span className="text-slate-800 font-medium">{doctor.experience}</span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-24">Fee:</span>
                  <span className="text-slate-800 font-medium">{doctor.fee}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-slate-500 text-sm mb-2">Certifications:</p>
                <div className="flex flex-wrap gap-2">
                  {doctor.certifications.map((cert, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-slate-500 text-sm mb-2">Languages:</p>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map((lang, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsManagement;