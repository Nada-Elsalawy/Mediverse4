

import React, { useState, useEffect } from "react";
import { Card } from "@heroui/react";
import axios from "axios";
import img1 from "../../assets/img/doctors-checking-medical-history.jpg";

export default function FollowUpAppointment() {
  const [reason, setReason] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const API_BASE =
    "https://subrhombical-akilah-interproglottidal.ngrok-free.dev";

  useEffect(() => {
    setDepartments([
      "General Practitioner",
      "Family Medicine",
      "Neurology",
      "Cardiology",
      "Orthopedics",
      "Pulmonology",
      "Pediatrics",
      "Emergency Medicine",
      "Ophthalmology",
      "Dermatology",
      "Internal Medicine",
      "Psychiatry",
    ]);
  }, []);

  useEffect(() => {
    if (!selectedDepartment) return;

    const fetchDoctors = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/chatbot/doctors/${selectedDepartment}`,
          {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          }
        );
        const doctorsList = res.data?.available_doctors || [];
        setDoctors(doctorsList);
        setSelectedDoctor("");
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    fetchDoctors();
  }, [selectedDepartment]);

  const handleCancel = () => {
    setReason("");
    setSelectedDepartment("");
    setSelectedDoctor("");
    setSelectedDate("");
    setSelectedTime("");
  };

  const openModal = () => setShowConfirmModal(true);

  const confirmDoctor = (doctorName) => {
    setSelectedDoctor(doctorName);
    setShowConfirmModal(true);
  };

  
  const DoctorCard = ({
    name,
    specialty,
    image,
    availability,
    currentPatients,
    rating = 4,
  }) => {
    return (
      <div className="bg-white rounded-xl border border-[#d5e4ff] shadow-sm p-4 flex flex-col min-h-[260px]">

        
        <img
          src={img1}
          alt={name}
          className="w-full h-28 object-cover rounded-lg mb-3"
        />

        
        <div className="flex items-center justify-between mb-2">
          <p className="text-[#1e3a8a] font-semibold text-[14px] truncate">
            {name}
          </p>

          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span
                key={idx}
                className="text-yellow-400 text-[12px]"
              >
                {idx < rating ? "★" : "☆"}
              </span>
            ))}
          </div>
        </div>

        {/* التخصص */}
        <p className="text-[#6b7280] text-[13px] mb-3">{specialty}</p>

      
        <div
          className="bg-[#A3C4F3] rounded-xl mb-4 w-full px-3 py-2 overflow-hidden"
          style={{ height: "48px" }}
        >
          <div className="flex items-center gap-2">
            
            <div className="w-6 h-6 bg-azraq-400 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">✔</span>
            </div>

            
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="text-white font-semibold text-[12px] truncate">
                {availability.status}
              </span>
              <span className="text-white text-[11px] truncate">
                {availability.details}
              </span>
            </div>
          </div>
        </div>

        {/* Current Patients */}
        <p className="text-[#1e3a8a] text-[14px] font-semibold mb-2 mt-auto text-center">
          Current Patients: {currentPatients}
        </p>

        <button
          onClick={() => confirmDoctor(name)}
          className="bg-azraq-400 text-white w-full py-2 rounded-lg text-[14px] font-medium hover:opacity-90 shadow-sm"
        >
          Confirm Now
        </button>
      </div>
    );
  };

  
  return (
    <div className="min-h-screen bg-[#f4f8ff] flex justify-center pt-16 px-4 pb-10 relative">

      {/* Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[420px] text-center border border-[#d5e4ff]">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-azraq-400 flex items-center justify-center">
                <span className="text-white text-2xl">✔</span>
              </div>
            </div>
            <h2 className="text-[20px] font-semibold text-[#1e3a8a] mb-2">
              Appointment Confirmed
            </h2>
            <p className="text-[15px] text-[#374151] leading-relaxed mb-6">
              Your appointment with {selectedDoctor} <br />
              on{" "}
              <b>
                {selectedDate || "selected date"} at{" "}
                {selectedTime || "selected time"}
              </b>
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-azraq-400 text-white px-6 py-2 rounded-lg shadow-md text-[14px] font-medium">
                View Appointment
              </button>
              <button
                className="bg-gray-200 text-[#1e3a8a] px-6 py-2 rounded-lg shadow-md text-[14px] font-medium"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        
        <button
          onClick={() => window.history.back()}
          className="text-[#1e3a8a] text-[15px] font-semibold mb-4 hover:underline"
        >
          ← Back
        </button>

        <div className="mb-8">
          <h1 className="text-[24px] font-semibold text-[#1e3a8a] mb-1 tracking-wide">
            Schedule Your Follow-Up Appointment
          </h1>
          <p className="text-[#6b7280] text-[20px]">
            Please confirm the details for your upcoming visit
          </p>
        </div>

        {/* Patient Info */}
        <Card className="bg-[#e6f0ff] rounded-xl shadow-sm mb-6 border border-[#d5e4ff]">
          <div className="p-6">
            <h2 className="text-[#1e3a8a] font-semibold mb-4 text-[17px]">
              Patient Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[#6b7280] text-[14px] mb-1">Full name</p>
                <p className="font-semibold text-[#111827] text-[15px]">
                  Ahmed Saeid Eldin
                </p>

                <p className="text-[#6b7280] text-[14px] mt-5 mb-1">
                  Patient ID
                </p>
                <p className="font-semibold text-[#111827] text-[15px]">
                  PA-1234
                </p>
              </div>

              <div>
                <p className="text-[#6b7280] text-[14px] mb-1">
                  Current Status
                </p>
                <p className="font-semibold text-[#111827] text-[15px]">
                  Post-Chemotherapy Review
                </p>

                <p className="text-[#6b7280] text-[14px] mt-5 mb-1">
                  Suggested Doctor
                </p>
                <p className="font-semibold text-[#111827] text-[15px]">
                  {selectedDoctor || "Dr. Miller"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* AI Recommendation */}
        <Card className="bg-[#ebf3ff] rounded-xl shadow-sm p-6 border border-[#d5e4ff] mb-8">
          <h1 className="text-[24px] font-semibold text-[#1e3a8a] mb-1 tracking-wide">
            AI Recommendation
          </h1>
          <p className="text-[#6b7280] text-[20px] mb-6">
            We suggest an appointment with these doctors
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DoctorCard
              name="Dr. Mona"
              specialty="Oncology Specialist"
              image={img1}
              availability={{
                status: "Available now",
                details: "No wait time — Room123, Floor4",
              }}
              currentPatients={5}
              rating={4}
            />
            <DoctorCard
              name="Dr. Eman"
              specialty="Oncology Specialist"
              image={img1}
              availability={{
                status: "Available now",
                details: "Room124, Floor4",
              }}
              currentPatients={1}
              rating={4}
            />
            <DoctorCard
              name="Dr. Saad"
              specialty="Oncology Specialist"
              image={img1}
              availability={{
                status: "Available now",
                details: "2m wait time — Room125, Floor4",
              }}
              currentPatients={0}
              rating={4}
            />
            <DoctorCard
              name="Dr. Mahmoud"
              specialty="Oncology Specialist"
              image={img1}
              availability={{
                status: "Available now",
                details: "10s wait time — Room126, Floor4",
              }}
              currentPatients={3}
              rating={4}
            />
          </div>
        </Card>

        {/* Appointment Details */}
        <Card className="bg-[#ebf3ff] rounded-xl shadow-sm p-6 border border-[#d5e4ff]">
          <h2 className="text-[#1e3a8a] font-semibold text-[17px] mb-4">
            Appointment Details
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[#374151] text-[14px] mb-2 block">
                Select Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border rounded-lg bg-white p-3 text-[14px] text-[#111827] mb-5 w-full"
              >
                <option value="">Choose Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <label className="text-[#374151] text-[14px] mb-2 block">
                Preferred Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-lg bg-white p-3 text-[14px] text-[#111827] mb-5 w-full"
              />
            </div>

            <div>
              <label className="text-[#374151] text-[14px] mb-2 block">
                Select Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="border rounded-lg bg-white p-3 text-[14px] text-[#111827] mb-5 w-full"
              >
                <option value="">Choose Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name}
                  </option>
                ))}
              </select>

              <label className="text-[#374151] text-[14px] mb-2 block">
                Preferred Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="border rounded-lg bg-white p-3 text-[14px] text-[#111827] mb-5 w-full"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-[#374151] text-[14px] mb-2 block">
              Reason for Visit (Optional)
            </label>
            <div className="bg-white border border-[#d1d5db] rounded-xl shadow-sm p-3">
              <textarea
                placeholder="Briefly describe the reason for visit..."
                className="w-full bg-transparent text-[14px] text-[#111827] resize-none outline-none h-44"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Buttons */}
        <div className="flex justify-center gap-6 mt-10 mb-10">
          <button
            className="bg-azraq-400 text-white px-6 py-3 rounded-lg text-[15px] font-medium shadow-md hover:opacity-90"
            onClick={openModal}
          >
            Confirm Appointment
          </button>
          <button
            onClick={handleCancel}
            className="bg-azraq-500 text-white px-6 py-3 rounded-lg text-[15px] font-medium shadow-md hover:opacity-90"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}