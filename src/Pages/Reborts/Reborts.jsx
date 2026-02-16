



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function FollowUpAppointment() {
//   const navigate = useNavigate();
  
//   const [reason, setReason] = useState("");
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");

//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState("");
//   const [selectedDoctorId, setSelectedDoctorId] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");

//   const API_BASE = "https://subrhombical-akilah-interproglottidal.ngrok-free.dev";

//   // ✅ DEBUG CODE - للتشخيص
//   useEffect(() => {
//     console.log("════════════════════════════════════");
//     console.log("🔍 BUTTON STATE:");
//     console.log("════════════════════════════════════");
//     console.log("selectedDoctorId:", selectedDoctorId, typeof selectedDoctorId);
//     console.log("selectedDate:", selectedDate);
//     console.log("selectedTime:", selectedTime);
//     console.log("loading:", loading);
//     console.log("doctors.length:", doctors.length);
//     console.log("════════════════════════════════════");
    
//     const isDisabled = loading || !selectedDoctorId || !selectedDate || !selectedTime;
//     console.log("🔘 Button DISABLED:", isDisabled);
    
//     if (isDisabled) {
//       console.log("❌ Reasons:");
//       if (loading) console.log("  - loading = true");
//       if (!selectedDoctorId) console.log("  - selectedDoctorId is EMPTY");
//       if (!selectedDate) console.log("  - selectedDate is empty");
//       if (!selectedTime) console.log("  - selectedTime is empty");
//     } else {
//       console.log("✅ Button is ENABLED!");
//     }
    
//     console.log("════════════════════════════════════");
//   }, [selectedDoctorId, selectedDate, selectedTime, loading, doctors]);

//   // Get current patient ID
//   const getCurrentPatientId = () => {
//     return localStorage.getItem('patientId') || 'P001';
//   };

//   // Load departments
//   useEffect(() => {
//     const loadDepartments = async () => {
//       try {
//         const response = await axios.get(`${API_BASE}/appointments/specialties`, {
//           headers: { "ngrok-skip-browser-warning": "true" }
//         });
        
//         let depts = response.data.specialties || response.data || [];
        
//         if (!Array.isArray(depts)) {
//           depts = [];
//         }
        
//         if (depts.length > 0 && typeof depts[0] === 'object' && depts[0].name) {
//           depts = depts.map(d => d.name);
//         }
        
//         setDepartments(depts);
//       } catch (error) {
//         console.error("Error loading departments:", error);
//         setDepartments([
//           "General Practitioner",
//           "Family Medicine",
//           "Neurology",
//           "Cardiology",
//           "Orthopedics",
//           "Pulmonology",
//           "Pediatrics",
//           "Emergency Medicine",
//           "Ophthalmology",
//           "Dermatology",
//           "Internal Medicine",
//           "Psychiatry",
//         ]);
//       }
//     };
    
//     loadDepartments();
//   }, []);

//   // Load doctors when department changes
//   useEffect(() => {
//     if (!selectedDepartment) return;

//     const fetchDoctors = async () => {
//       try {
//         console.log("🏥 Fetching doctors for:", selectedDepartment);
        
//         const res = await axios.get(
//           `${API_BASE}/appointments/doctors`,
//           {
//             params: { specialty: selectedDepartment },
//             headers: { "ngrok-skip-browser-warning": "true" }
//           }
//         );
        
//         console.log("🏥 Raw doctors response:", res.data);
        
//         let doctorsList = res.data.doctors || res.data || [];
        
//         if (!Array.isArray(doctorsList)) {
//           console.log("⚠️ Doctors is not array");
//           doctorsList = [];
//         }
        
//         console.log("🏥 Doctors before filter:", doctorsList);
        
//         doctorsList = doctorsList.filter(doc => {
//           const isValid = doc && doc.id !== undefined && doc.id !== null && doc.name;
//           if (!isValid) {
//             console.warn("⚠️ Invalid doctor:", doc);
//           }
//           return isValid;
//         });
        
//         console.log("✅ Valid doctors:", doctorsList);
        
//         setDoctors(doctorsList);
//         setSelectedDoctor("");
//         // ✅ CRITICAL FIX: لا تعمل reset للـ selectedDoctorId!
//         // setSelectedDoctorId(""); ← ❌ هذا السطر محذوف - كان السبب في المشكلة!
        
//       } catch (err) {
//         console.error("❌ Error fetching doctors:", err);
//         setDoctors([]);
//       }
//     };

//     fetchDoctors();
//   }, [selectedDepartment]);

//   const handleCancel = () => {
//     setReason("");
//     setSelectedDepartment("");
//     setSelectedDoctor("");
//     setSelectedDoctorId("");
//     setSelectedDate("");
//     setSelectedTime("");
//   };

//   // Handle doctor selection
//   const handleDoctorChange = (e) => {
//     const doctorId = e.target.value;
    
//     console.log("════════════════════════════════════");
//     console.log("👨‍⚕️ Doctor Selection:");
//     console.log("════════════════════════════════════");
//     console.log("Selected ID:", doctorId);
//     console.log("Type:", typeof doctorId);
//     console.log("Available doctors:", doctors);
    
//     setSelectedDoctorId(doctorId);
//     console.log("✅ setSelectedDoctorId called");
    
//     const doctor = doctors.find(d => String(d.id) === String(doctorId));
//     console.log("Found doctor:", doctor);
    
//     if (doctor) {
//       setSelectedDoctor(doctor.name);
//       console.log("✅ Doctor name set:", doctor.name);
//     } else {
//       console.warn("⚠️ Doctor not found!");
//     }
//     console.log("════════════════════════════════════");
//   };

//   // Main function: Confirm Appointment
//   const handleConfirmAppointment = async () => {
//     // ✅ Validation
//     if (!selectedDoctorId || !selectedDate || !selectedTime) {
//       alert("Please fill all required fields!");
//       return;
//     }

//     // ✅ Validate date is not in the past
//     const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
//     const now = new Date();
//     if (selectedDateTime < now) {
//       alert("Cannot book appointments in the past. Please select a future date and time.");
//       return;
//     }

//     // ✅ Validate patient data exists
//     const patientData = JSON.parse(localStorage.getItem('patient') || '{}');
//     if (!patientData.id && !patientData.patient_id) {
//       alert("Patient information not found. Please log in again.");
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log("Step 1: Checking doctor availability...");
      
//       const slotsResponse = await axios.get(
//         `${API_BASE}/appointments/doctors/${selectedDoctorId}/slots`,
//         {
//           params: { date: selectedDate },
//           headers: { "ngrok-skip-browser-warning": "true" }
//         }
//       );

//       const doctorData = slotsResponse.data;
//       console.log("Doctor data:", doctorData);
      
//       const isAvailable = 
//         doctorData.available === true || 
//         doctorData.status === "available" ||
//         (Array.isArray(doctorData.slots) && doctorData.slots.length > 0) ||
//         (doctorData.current_patients !== undefined && doctorData.current_patients === 0);
      
//       console.log("Is doctor available?", isAvailable);

//       if (isAvailable) {
//         console.log("Step 2A: Doctor available, booking...");
//         await bookDirectAppointment();
//       } else {
//         console.log("Step 2B: Doctor busy, joining queue...");
//         await joinWaitingQueue();
//       }

//     } catch (error) {
//       console.error("Error:", error);
//       handleError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Book direct appointment
//   const bookDirectAppointment = async () => {
//     try {
//       const bookingData = {
//         doctor_id: selectedDoctorId,
//         patient_id: getCurrentPatientId(),
//         appointment_date: selectedDate,
//         appointment_time: selectedTime,
//         specialty: selectedDepartment,
//         reason: reason || "Follow-up appointment"
//       };

//       console.log("════════════════════════════════════");
//       console.log("📤 SENDING BOOKING REQUEST");
//       console.log("════════════════════════════════════");
//       console.log("Booking data:", JSON.stringify(bookingData, null, 2));
//       console.log("API URL:", `${API_BASE}/appointments/book`);
//       console.log("════════════════════════════════════");

//       const response = await axios.post(
//         `${API_BASE}/appointments/book`,
//         bookingData,
//         {
//           headers: {
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       console.log("✅ Booking response:", response.data);

//       if (response.data) {
//         // ✅ حفظ بيانات المريض في localStorage (من patient في localStorage)
//         const patientData = JSON.parse(localStorage.getItem('patient') || '{}');
//         const patientFullData = {
//           id: getCurrentPatientId(),
//           name: patientData.name || patientData.full_name || 'Patient',
//           age: patientData.age || patientData.patient_age,
//           gender: patientData.gender || patientData.patient_gender,
//           weight: patientData.weight || patientData.patient_weight,
//           height: patientData.height || patientData.patient_height,
          
//           // البيانات المفقودة
//           national_id: patientData.national_id || patientData.nationalId || patientData.ssn,
//           blood_type: patientData.blood_type || patientData.bloodType,
//           bmi: patientData.bmi || patientData.BMI,
          
//           chronic_diseases: patientData.chronic_diseases || [],
//           allergies: patientData.allergies || [],
//           current_medications: patientData.medications || patientData.current_medications || [],
//           phone: patientData.phone || patientData.phone_number,
//           email: patientData.email,
          
//           // بيانات الحجز
//           symptoms: reason || 'Follow-up appointment',
//           appointment_date: selectedDate,
//           appointment_time: selectedTime,
//           appointment_id: response.data.appointment_id
//         };

//         // ✅ حفظ بيانات الدكتور
//         const selectedDoctorData = doctors.find(d => d.id === selectedDoctorId);
//         const doctorFullData = {
//           id: selectedDoctorId,
//           name: selectedDoctor,
//           specialty: selectedDepartment,
//           specialty_ar: selectedDoctorData?.specialty_ar || selectedDepartment,
//           rating: selectedDoctorData?.rating || 4.5,
//           floor: selectedDoctorData?.floor || 'N/A',
//           room: selectedDoctorData?.room || 'N/A',
//           current_patients: selectedDoctorData?.current_patients || 0
//         };

//         console.log('💾 Saving patient data:', patientFullData);
//         console.log('💾 Saving doctor data:', doctorFullData);

//         localStorage.setItem('selectedDoctor', JSON.stringify(doctorFullData));
//         localStorage.setItem('currentPatient', JSON.stringify(patientFullData));

//         setModalMessage("Appointment confirmed! The doctor is available. Redirecting...");
//         setShowConfirmModal(true);

//         setTimeout(() => {
//           console.log("Redirecting to doctor page...");
//           navigate("/dr");
//         }, 2000);
//       }
//     } catch (error) {
//       console.error("Error booking:", error);
//       throw error;
//     }
//   };

//   // Join waiting queue
//   const joinWaitingQueue = async () => {
//     try {
//       const queueData = {
//         doctor_id: selectedDoctorId,
//         patient_id: getCurrentPatientId(),
//         appointment_date: selectedDate,
//         appointment_time: selectedTime,
//         specialty: selectedDepartment,
//         reason: reason || "Follow-up appointment"
//       };

//       console.log("Queue data:", queueData);

//       const response = await axios.post(
//         `${API_BASE}/queue/join`,
//         queueData,
//         {
//           headers: {
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       console.log("Queue response:", response.data);

//       if (response.data) {
//         const queueId = response.data.queue_id;
//         const position = response.data.position || 1;
//         const estimatedWait = response.data.estimated_wait || "15-25 minutes";

//         console.log(`Joined queue: ${queueId}, Position: ${position}`);

//         // ✅ حفظ بيانات المريض في localStorage
//         const patientData = JSON.parse(localStorage.getItem('patient') || '{}');
//         const patientFullData = {
//           id: getCurrentPatientId(),
//           name: patientData.name || patientData.full_name || 'Patient',
//           age: patientData.age || patientData.patient_age,
//           gender: patientData.gender || patientData.patient_gender,
//           weight: patientData.weight || patientData.patient_weight,
//           height: patientData.height || patientData.patient_height,
          
//           // البيانات المفقودة
//           national_id: patientData.national_id || patientData.nationalId || patientData.ssn,
//           blood_type: patientData.blood_type || patientData.bloodType,
//           bmi: patientData.bmi || patientData.BMI,
          
//           chronic_diseases: patientData.chronic_diseases || [],
//           allergies: patientData.allergies || [],
//           current_medications: patientData.medications || patientData.current_medications || [],
//           phone: patientData.phone || patientData.phone_number,
//           email: patientData.email,
          
//           // بيانات الحجز
//           symptoms: reason || 'Follow-up appointment',
//           appointment_date: selectedDate,
//           appointment_time: selectedTime,
//           queue_id: queueId
//         };

//         // ✅ حفظ بيانات الدكتور
//         const selectedDoctorData = doctors.find(d => d.id === selectedDoctorId);
//         const doctorFullData = {
//           id: selectedDoctorId,
//           name: selectedDoctor,
//           specialty: selectedDepartment,
//           specialty_ar: selectedDoctorData?.specialty_ar || selectedDepartment,
//           rating: selectedDoctorData?.rating || 4.5,
//           floor: selectedDoctorData?.floor || 'N/A',
//           room: selectedDoctorData?.room || 'N/A',
//           current_patients: selectedDoctorData?.current_patients || 0,
//           estimated_wait_minutes: estimatedWait
//         };

//         // ✅ حفظ بيانات الـ queue
//         const queueFullData = {
//           queue_id: queueId,
//           doctor: doctorFullData,
//           patient: patientFullData,
//           position: position,
//           estimated_wait_minutes: estimatedWait,
//           status: 'waiting'
//         };

//         console.log('💾 Saving patient data:', patientFullData);
//         console.log('💾 Saving doctor data:', doctorFullData);
//         console.log('💾 Saving queue data:', queueFullData);

//         localStorage.setItem('selectedDoctor', JSON.stringify(doctorFullData));
//         localStorage.setItem('currentPatient', JSON.stringify(patientFullData));
//         localStorage.setItem('queueData', JSON.stringify(queueFullData));

//         setModalMessage(`Doctor is busy. You're in queue at position #${position}. Redirecting...`);
//         setShowConfirmModal(true);

//         setTimeout(() => {
//           console.log("Redirecting to waiting page...");
//           navigate("/wating");
//         }, 2000);
//       }
//     } catch (error) {
//       console.error("Error joining queue:", error);
//       throw error;
//     }
//   };

//   // Error handler
//   const handleError = (error) => {
//     console.error("════════════════════════════════════");
//     console.error("❌ ERROR OCCURRED");
//     console.error("════════════════════════════════════");
//     console.error("Full error:", error);
    
//     let errorMessage = "An error occurred. Please try again.";
//     let errorDetails = "";

//     if (error.response) {
//       const status = error.response.status;
//       const data = error.response.data;

//       console.error("Status:", status);
//       console.error("Response data:", data);
//       console.error("════════════════════════════════════");

//       // Extract detailed error message
//       if (data.message) {
//         errorDetails = data.message;
//       } else if (data.error) {
//         errorDetails = data.error;
//       } else if (data.detail) {
//         errorDetails = data.detail;
//       } else if (typeof data === 'string') {
//         errorDetails = data;
//       }

//       switch (status) {
//         case 400:
//           errorMessage = "Invalid data provided";
//           break;
//         case 404:
//           errorMessage = "Doctor not found. Please select another doctor.";
//           break;
//         case 409:
//           errorMessage = "This time slot is already booked. Please select another time.";
//           break;
//         case 422:
//           errorMessage = "Validation error - please check your inputs";
//           // Log specific validation errors
//           if (data.errors) {
//             console.error("Validation errors:", data.errors);
//             errorDetails = Object.entries(data.errors)
//               .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
//               .join('\n');
//           }
//           break;
//         case 500:
//           errorMessage = "Server error. Please try again later.";
//           break;
//         default:
//           errorMessage = errorDetails || "An error occurred";
//       }
//     } else if (error.request) {
//       console.error("No response received");
//       console.error("Request:", error.request);
//       console.error("════════════════════════════════════");
//       errorMessage = "Network error. Please check your connection.";
//     } else {
//       console.error("Error message:", error.message);
//       console.error("════════════════════════════════════");
//       errorMessage = error.message;
//     }

//     // Show detailed error in alert
//     const fullErrorMessage = errorDetails 
//       ? `${errorMessage}\n\nDetails: ${errorDetails}` 
//       : errorMessage;
    
//     alert(fullErrorMessage);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center px-4 py-8">
      
//       {/* Loading/Confirmation Modal */}
//       {(showConfirmModal || loading) && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center">
//             {loading ? (
//               <>
//                 <div className="flex justify-center mb-4">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
//                 </div>
//                 <h2 className="text-xl font-semibold text-slate-800 mb-2">
//                   Processing...
//                 </h2>
//                 <p className="text-slate-600">
//                   Please wait while we check availability
//                 </p>
//               </>
//             ) : (
//               <>
//                 <div className="flex justify-center mb-4">
//                   <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
//                     <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
//                     </svg>
//                   </div>
//                 </div>
//                 <h2 className="text-xl font-semibold text-slate-800 mb-3">
//                   Success!
//                 </h2>
//                 <p className="text-slate-600 leading-relaxed">
//                   {modalMessage}
//                 </p>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Main Form */}
//       <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8">
//         {/* Logo */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-slate-800">
//             <span className="text-blue-600">Medi</span>verse
//           </h1>
//         </div>

//         {/* Title */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-slate-800 mb-2">
//             Appointment Details
//           </h2>
//         </div>

//         {/* Form */}
//         <div className="space-y-6">
          
//           {/* Debug Info */}
//           {process.env.NODE_ENV === 'development' && (
//             <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
//               <div><strong>Debug Info:</strong></div>
//               <div>Department: {selectedDepartment || 'none'}</div>
//               <div>Doctor ID: {selectedDoctorId || 'none'}</div>
//               <div>Doctor Name: {selectedDoctor || 'none'}</div>
//               <div>Date: {selectedDate || 'none'}</div>
//               <div>Time: {selectedTime || 'none'}</div>
//               <div>Doctors count: {doctors.length}</div>
//               <div>Button disabled: {(loading || !selectedDoctorId || !selectedDate || !selectedTime) ? 'YES' : 'NO'}</div>
//             </div>
//           )}
          
//           {/* Department & Doctor Row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Department */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Select Department <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={selectedDepartment}
//                 onChange={(e) => {
//                   const dept = e.target.value;
//                   console.log("🏢 Department selected:", dept);
//                   setSelectedDepartment(dept);
//                 }}
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                 required
//               >
//                 <option value="">Choose Department</option>
//                 {departments.map((dept, index) => {
//                   const deptValue = typeof dept === 'string' ? dept : (dept.name || dept.key || '');
//                   const deptLabel = typeof dept === 'string' ? dept : (dept.name || dept.key || '');
                  
//                   return (
//                     <option key={`dept-${index}`} value={deptValue}>
//                       {deptLabel}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>

//             {/* Doctor */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Select Doctor <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={selectedDoctorId}
//                 onChange={handleDoctorChange}
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                 required
//                 disabled={!selectedDepartment}
//               >
//                 <option value="">Choose Doctor</option>
//                 {doctors.map((doc) => (
//                   <option key={doc.id} value={doc.id}>
//                     {doc.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Date & Time Row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Date */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Preferred Date <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => {
//                   const date = e.target.value;
//                   console.log("📅 Date selected:", date);
//                   setSelectedDate(date);
//                 }}
//                 min={new Date().toISOString().split('T')[0]}
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                 required
//               />
//             </div>

//             {/* Time */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Preferred Time <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="time"
//                 value={selectedTime}
//                 onChange={(e) => {
//                   const time = e.target.value;
//                   console.log("⏰ Time selected:", time);
//                   setSelectedTime(time);
//                 }}
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                 required
//               />
//             </div>
//           </div>

//           {/* Reason */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Reason for Visit (Optional)
//             </label>
//             <textarea
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               placeholder="Briefly describe the reason for visit"
//               className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
//               rows="4"
//             />
//           </div>
//         </div>

//         {/* Note */}
//         <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//           <div className="flex items-start gap-3">
//             <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <p className="text-sm text-blue-800 leading-relaxed">
//               <strong className="font-semibold">Note:</strong> If the doctor is available, you'll be directed to their page immediately. 
//               If they're currently busy, you'll join the waiting queue and be notified when it's your turn.
//             </p>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-4 mt-8">
//           <button
//             onClick={() => {
//               console.log("🔘 CONFIRM BUTTON CLICKED!");
//               handleConfirmAppointment();
//             }}
//             disabled={loading || !selectedDoctorId || !selectedDate || !selectedTime}
//             className={`flex-1 font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg ${
//               loading || !selectedDoctorId || !selectedDate || !selectedTime
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl active:scale-95'
//             }`}
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Processing...
//               </span>
//             ) : (
//               "Confirm Appointment"
//             )}
//           </button>
//           <button
//             onClick={handleCancel}
//             disabled={loading}
//             className={`flex-1 font-semibold py-3.5 px-6 rounded-xl transition-all shadow-md ${
//               loading
//                 ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                 : 'bg-gray-200 hover:bg-gray-300 text-gray-800 active:scale-95'
//             }`}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }







import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@heroui/react";
import axios from "axios";

export default function FollowUpAppointment() {
  const navigate = useNavigate();
  
  const [reason, setReason] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const API_BASE = "https://subrhombical-akilah-interproglottidal.ngrok-free.dev";

  // Get current patient ID
  const getCurrentPatientId = () => {
    const patientId = localStorage.getItem('patientId');
    const patient = localStorage.getItem('patient');
    
    if (patientId && patientId !== 'null' && patientId !== 'undefined') {
      return patientId;
    }
    
    if (patient) {
      try {
        const patientData = JSON.parse(patient);
        const id = patientData.id || patientData.patient_id || patientData.patientId;
        if (id && id !== 'null' && id !== 'undefined') {
          return id;
        }
      } catch (e) {
        console.error("Error parsing patient data:", e);
      }
    }
    
    console.warn("⚠️ Patient ID not found in localStorage. Using default 'P001'");
    return 'P001';
  };

  // Load departments
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE}/appointments/specialties`, {
          headers: { "ngrok-skip-browser-warning": "true" }
        });
        
        let depts = response.data.specialties || response.data || [];
        
        if (!Array.isArray(depts)) {
          depts = [];
        }
        
        if (depts.length > 0 && typeof depts[0] === 'object' && depts[0].name) {
          depts = depts.map(d => d.name);
        }
        
        setDepartments(depts);
      } catch (error) {
        console.error("Error loading departments:", error);
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
      }
    };
    
    loadDepartments();
  }, []);

  // Load doctors when department changes
  useEffect(() => {
    if (!selectedDepartment) return;

    const fetchDoctors = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/appointments/doctors`,
          {
            params: { specialty: selectedDepartment },
            headers: { "ngrok-skip-browser-warning": "true" }
          }
        );
        
        let doctorsList = res.data.doctors || res.data || [];
        
        if (!Array.isArray(doctorsList)) {
          doctorsList = [];
        }
        
        doctorsList = doctorsList.filter(doc => {
          return doc && doc.id !== undefined && doc.id !== null && doc.name;
        });
        
        setDoctors(doctorsList);
        setSelectedDoctor("");
        
      } catch (err) {
        console.error("❌ Error fetching doctors:", err);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, [selectedDepartment]);

  const handleCancel = () => {
    setReason("");
    setSelectedDepartment("");
    setSelectedDoctor("");
    setSelectedDoctorId("");
    setSelectedDate("");
    setSelectedTime("");
  };

  // Handle doctor selection
  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setSelectedDoctorId(doctorId);
    
    const doctor = doctors.find(d => String(d.id) === String(doctorId));
    if (doctor) {
      setSelectedDoctor(doctor.name);
    }
  };

  // Main function: Confirm Appointment
  const handleConfirmAppointment = async () => {
    // Validation
    if (!selectedDoctorId || !selectedDate || !selectedTime) {
      alert("Please fill all required fields!");
      return;
    }

    // Validate date is not in the past
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();
    if (selectedDateTime < now) {
      alert("Cannot book appointments in the past. Please select a future date and time.");
      return;
    }

    // Validate patient data exists
    const patientData = JSON.parse(localStorage.getItem('patient') || '{}');
    if (!patientData.id && !patientData.patient_id) {
      alert("Patient information not found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const slotsResponse = await axios.get(
        `${API_BASE}/appointments/doctors/${selectedDoctorId}/slots`,
        {
          params: { date: selectedDate },
          headers: { "ngrok-skip-browser-warning": "true" }
        }
      );

      const doctorData = slotsResponse.data;
      
      const isAvailable = 
        doctorData.available === true || 
        doctorData.status === "available" ||
        (Array.isArray(doctorData.slots) && doctorData.slots.length > 0) ||
        (doctorData.current_patients !== undefined && doctorData.current_patients === 0);

      if (isAvailable) {
        await bookDirectAppointment();
      } else {
        await joinWaitingQueue();
      }

    } catch (error) {
      console.error("Error:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Book direct appointment
  const bookDirectAppointment = async () => {
    try {
      const patientId = getCurrentPatientId();
      
      if (!patientId || patientId === 'undefined' || patientId === 'null') {
        throw new Error("Patient ID not found. Please log in again.");
      }
      
      const bookingData = {
        doctor_id: parseInt(selectedDoctorId) || selectedDoctorId,
        patient_id: patientId,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        specialty: selectedDepartment,
        reason: reason || "Follow-up appointment"
      };

      const response = await axios.post(
        `${API_BASE}/appointments/book`,
        bookingData,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data) {
        const patientData = JSON.parse(localStorage.getItem('patient') || '{}');
        const patientFullData = {
          id: getCurrentPatientId(),
          name: patientData.name || patientData.full_name || 'Patient',
          age: patientData.age || patientData.patient_age,
          gender: patientData.gender || patientData.patient_gender,
          weight: patientData.weight || patientData.patient_weight,
          height: patientData.height || patientData.patient_height,
          national_id: patientData.national_id || patientData.nationalId || patientData.ssn,
          blood_type: patientData.blood_type || patientData.bloodType,
          bmi: patientData.bmi || patientData.BMI,
          chronic_diseases: patientData.chronic_diseases || [],
          allergies: patientData.allergies || [],
          current_medications: patientData.medications || patientData.current_medications || [],
          phone: patientData.phone || patientData.phone_number,
          email: patientData.email,
          symptoms: reason || 'Follow-up appointment',
          appointment_date: selectedDate,
          appointment_time: selectedTime,
        };

        const selectedDoctorData = doctors.find(d => String(d.id) === String(selectedDoctorId));
        const doctorFullData = {
          id: selectedDoctorId,
          name: selectedDoctor,
          specialty: selectedDepartment,
          specialty_ar: selectedDoctorData?.specialty_ar || selectedDepartment,
          rating: selectedDoctorData?.rating || 4.5,
          floor: selectedDoctorData?.floor || 'N/A',
          room: selectedDoctorData?.room || 'N/A',
          current_patients: selectedDoctorData?.current_patients || 0,
        };

        localStorage.setItem('selectedDoctor', JSON.stringify(doctorFullData));
        localStorage.setItem('currentPatient', JSON.stringify(patientFullData));

        setModalMessage("Appointment confirmed! The doctor is available. Redirecting...");
        setShowConfirmModal(true);

        setTimeout(() => {
          navigate("/dr");
        }, 2000);
      }
    } catch (error) {
      console.error("Error booking:", error);
      throw error;
    }
  };

  // Join waiting queue
  const joinWaitingQueue = async () => {
    try {
      const patientId = getCurrentPatientId();
      
      if (!patientId || patientId === 'undefined' || patientId === 'null') {
        throw new Error("Patient ID not found. Please log in again.");
      }
      
      if (!selectedDoctorId || selectedDoctorId === '') {
        throw new Error("Please select a doctor");
      }
      
      if (!selectedDate || !selectedTime) {
        throw new Error("Please select date and time");
      }
      
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(selectedDate)) {
        throw new Error("Invalid date format. Please select a valid date.");
      }
      
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(selectedTime)) {
        throw new Error("Invalid time format. Please select a valid time.");
      }
      
      const queueData = {
        doctor_id: parseInt(selectedDoctorId) || selectedDoctorId,
        patient_id: patientId,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        specialty: selectedDepartment,
        reason: reason || "Follow-up appointment"
      };

      const response = await axios.post(
        `${API_BASE}/queue/join`,
        queueData,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data) {
        const queueId = response.data.queue_id;
        const position = response.data.position || 1;
        const estimatedWait = response.data.estimated_wait || "15-25 minutes";

        const patientData = JSON.parse(localStorage.getItem('patient') || '{}');
        const patientFullData = {
          id: getCurrentPatientId(),
          name: patientData.name || patientData.full_name || 'Patient',
          age: patientData.age || patientData.patient_age,
          gender: patientData.gender || patientData.patient_gender,
          weight: patientData.weight || patientData.patient_weight,
          height: patientData.height || patientData.patient_height,
          national_id: patientData.national_id || patientData.nationalId || patientData.ssn,
          blood_type: patientData.blood_type || patientData.bloodType,
          bmi: patientData.bmi || patientData.BMI,
          chronic_diseases: patientData.chronic_diseases || [],
          allergies: patientData.allergies || [],
          current_medications: patientData.medications || patientData.current_medications || [],
          phone: patientData.phone || patientData.phone_number,
          email: patientData.email,
          symptoms: reason || 'Follow-up appointment',
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          queue_id: queueId
        };

        const selectedDoctorData = doctors.find(d => String(d.id) === String(selectedDoctorId));
        const doctorFullData = {
          id: selectedDoctorId,
          name: selectedDoctor,
          specialty: selectedDepartment,
          specialty_ar: selectedDoctorData?.specialty_ar || selectedDepartment,
          rating: selectedDoctorData?.rating || 4.5,
          floor: selectedDoctorData?.floor || 'N/A',
          room: selectedDoctorData?.room || 'N/A',
          current_patients: selectedDoctorData?.current_patients || 0,
          estimated_wait_minutes: estimatedWait
        };

        const queueFullData = {
          queue_id: queueId,
          doctor: doctorFullData,
          patient: patientFullData,
          position: position,
          estimated_wait_minutes: estimatedWait,
          status: 'waiting'
        };

        localStorage.setItem('selectedDoctor', JSON.stringify(doctorFullData));
        localStorage.setItem('currentPatient', JSON.stringify(patientFullData));
        localStorage.setItem('queueData', JSON.stringify(queueFullData));

        setModalMessage(`Doctor is busy. You're in queue at position #${position}. Redirecting...`);
        setShowConfirmModal(true);

        setTimeout(() => {
          navigate("/wating");
        }, 2000);
      }
    } catch (error) {
      console.error("Error joining queue:", error);
      throw error;
    }
  };

  // Error handler
  const handleError = (error) => {
    let errorMessage = "An error occurred. Please try again.";
    let errorDetails = "";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (data.message) {
        errorDetails = data.message;
      } else if (data.error) {
        errorDetails = data.error;
      } else if (data.detail) {
        if (typeof data.detail === 'string') {
          errorDetails = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorDetails = data.detail.map(err => {
            const field = err.loc?.slice(1).join(' -> ') || 'unknown';
            const msg = err.msg || 'validation error';
            const type = err.type || '';
            return `• ${field}: ${msg} ${type ? `(${type})` : ''}`;
          }).join('\n');
        } else if (typeof data.detail === 'object') {
          errorDetails = JSON.stringify(data.detail, null, 2);
        }
      } else if (typeof data === 'string') {
        errorDetails = data;
      }

      switch (status) {
        case 400:
          errorMessage = "Invalid data provided";
          break;
        case 404:
          errorMessage = "Doctor not found. Please select another doctor.";
          break;
        case 409:
          errorMessage = "This time slot is already booked. Please select another time.";
          break;
        case 422:
          errorMessage = "Validation error - please check your inputs";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        default:
          errorMessage = errorDetails || "An error occurred";
      }
    } else if (error.request) {
      errorMessage = "Network error. Please check your connection.";
    } else {
      errorMessage = error.message;
    }

    const fullErrorMessage = errorDetails 
      ? `${errorMessage}\n\nDetails:\n${errorDetails}` 
      : errorMessage;
    
    alert(fullErrorMessage);
  };

  return (
    <div className="min-h-screen bg-[#f4f8ff] flex justify-center pt-16 px-4 pb-10">
      
      {/* Loading/Confirmation Modal */}
      {(showConfirmModal || loading) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[420px] text-center border border-[#d5e4ff]">
            {loading ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1e3a8a]"></div>
                </div>
                <h2 className="text-[20px] font-semibold text-[#1e3a8a] mb-2">
                  Processing...
                </h2>
                <p className="text-[15px] text-[#374151]">
                  Please wait while we check availability
                </p>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-[20px] font-semibold text-[#1e3a8a] mb-2">
                  Success!
                </h2>
                <p className="text-[15px] text-[#374151] leading-relaxed">
                  {modalMessage}
                </p>
              </>
            )}
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
          <h1 className="text-[24px] font-semibold text-[#1e3a8a] mb-1">
            Schedule Your Follow-Up Appointment
          </h1>
          <p className="text-[#6b7280] text-[18px]">
            Please confirm the details for your upcoming visit
          </p>
        </div>

        {/* Appointment Details */}
        <Card className="bg-[#ebf3ff] rounded-xl shadow-sm p-6 border border-[#d5e4ff]">
          <h2 className="text-[#1e3a8a] font-semibold text-[17px] mb-4">
            Appointment Details
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-[14px] text-[#374151]">
                Select Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full border border-[#d5e4ff] rounded-lg p-3 mb-5 bg-white focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
              >
                <option value="">Choose Department</option>
                {departments.map((dept, index) => {
                  const deptValue = typeof dept === 'string' ? dept : (dept.name || dept.key || '');
                  const deptLabel = typeof dept === 'string' ? dept : (dept.name || dept.key || '');
                  
                  return (
                    <option key={`dept-${index}`} value={deptValue}>
                      {deptLabel}
                    </option>
                  );
                })}
              </select>

              <label className="block mb-2 text-[14px] text-[#374151]">
                Preferred Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-[#d5e4ff] rounded-lg p-3 bg-white focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-[14px] text-[#374151]">
                Select Doctor
              </label>
              <select
                value={selectedDoctorId}
                onChange={handleDoctorChange}
                className="w-full border border-[#d5e4ff] rounded-lg p-3 mb-5 bg-white focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                disabled={!selectedDepartment}
              >
                <option value="">Choose Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>

              <label className="block mb-2 text-[14px] text-[#374151]">
                Preferred Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border border-[#d5e4ff] rounded-lg p-3 bg-white focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-[14px] text-[#374151]">
              Reason for Visit (Optional)
            </label>
            <textarea
              className="w-full border border-[#d5e4ff] rounded-xl p-3 h-40 resize-none bg-white focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
              placeholder="Briefly describe the reason for visit..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </Card>

       

        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={handleConfirmAppointment}
            disabled={loading || !selectedDoctorId || !selectedDate || !selectedTime}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              loading || !selectedDoctorId || !selectedDate || !selectedTime
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#1e3a8a] text-white hover:bg-[#2c5aa0] active:scale-95 shadow-md'
            }`}
          >
            {loading ? 'Processing...' : 'Confirm Appointment'}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              loading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#3b5998] text-white hover:bg-[#4a69ad] active:scale-95 shadow-md'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}