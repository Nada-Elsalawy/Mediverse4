// import React, { useState, useRef, useEffect } from 'react';
// import doctorAPI from '../Services/DoctorServices';
// // ❌ الصور الثابتة اتشالت - هنعرض الملفات من الـ API فقط

// const DoctorDashboard = () => {
//   // State
//   const [isAvailable, setIsAvailable] = useState(true);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [showXrayModal, setShowXrayModal] = useState(false);
//   const [showBloodTestModal, setShowBloodTestModal] = useState(false);
//   const [xrayZoom, setXrayZoom] = useState(1);
//   const [labZoom, setLabZoom] = useState(1);
//   const [activeFilter, setActiveFilter] = useState('normal');
//   const [activeLabFilter, setActiveLabFilter] = useState('normal');
//   const [uploadedXray, setUploadedXray] = useState(null);
//   const [uploadedLab, setUploadedLab] = useState(null);
//   const [isConsulting, setIsConsulting] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // API Data
//   const [doctorProfile, setDoctorProfile] = useState(null);
//   const [patientQueue, setPatientQueue] = useState([]);
//   const [currentPatient, setCurrentPatient] = useState(null);
//   const [diagnosis, setDiagnosis] = useState('');
//   const [notes, setNotes] = useState('');
//   const [aiEvaluation, setAiEvaluation] = useState('');
//   const [patientMedicalFiles, setPatientMedicalFiles] = useState([]);
//   const [xrayFiles, setXrayFiles] = useState([]);
//   const [labTestFiles, setLabTestFiles] = useState([]);

//   // Drag state for X-ray
//   const [xrayPosition, setXrayPosition] = useState({ x: 0, y: 0 });
//   const [isDraggingXray, setIsDraggingXray] = useState(false);
//   const [xrayDragStart, setXrayDragStart] = useState({ x: 0, y: 0 });

//   // Drag state for Lab Test
//   const [labPosition, setLabPosition] = useState({ x: 0, y: 0 });
//   const [isDraggingLab, setIsDraggingLab] = useState(false);
//   const [labDragStart, setLabDragStart] = useState({ x: 0, y: 0 });

//   // File navigation
//   const [currentXrayIndex, setCurrentXrayIndex] = useState(0);
//   const [currentLabIndex, setCurrentLabIndex] = useState(0);

//   const xrayFileInputRef = useRef(null);
//   const labTestFileInputRef = useRef(null);

//   // Load initial data
//   useEffect(() => {
//     loadInitialData();
//   }, []);

//   const loadInitialData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // ✅ جلب بيانات الطبيب من localStorage (من ChatBot)
//       const savedDoctor = localStorage.getItem('selectedDoctor');
//       if (savedDoctor) {
//         const doctorData = JSON.parse(savedDoctor);
//         setDoctorProfile(doctorData);
//       } else {
//         // Fallback: Load from API
//         const profile = await doctorAPI.getProfile();
//         setDoctorProfile(profile);
//       }

//       // ✅ جلب بيانات المريض من localStorage (من ChatBot)
//       const savedPatient = localStorage.getItem('currentPatient');
//       if (savedPatient) {
//         const patientData = JSON.parse(savedPatient);
//         console.log('✅ Patient data loaded:', patientData);
//         setCurrentPatient(patientData);
//         setIsConsulting(true);
        
//         // ✅ جلب الملفات الطبية من الـ API
//         if (patientData.id) {
//           try {
//             const allFiles = await doctorAPI.getPatientFiles(patientData.id);
//             if (allFiles && allFiles.files && Array.isArray(allFiles.files)) {
//               setPatientMedicalFiles(allFiles.files);
              
//               const xrays = allFiles.files.filter(f => f.file_type === 'xray');
//               const labTests = allFiles.files.filter(f => f.file_type === 'lab_test');
              
//               setXrayFiles(xrays);
//               setLabTestFiles(labTests);
              
//               if (xrays.length > 0) {
//                 setUploadedXray(xrays[0].url || xrays[0].file_url);
//               }
//               if (labTests.length > 0) {
//                 setUploadedLab(labTests[0].url || labTests[0].file_url);
//               }
//             }
//           } catch (fileError) {
//             console.warn('⚠️ Could not load patient files:', fileError);
//           }
//         }
        
//         // Queue فاضية لأننا جايين من ChatBot مباشرة
//         setPatientQueue([]);
//       } else {
//         // Fallback: Load queue from API
//         const queue = await doctorAPI.getQueue();
//         setPatientQueue(queue || []);
//       }
//     } catch (err) {
//       setError('Failed to load data: ' + err.message);
//       console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle doctor status
//   const toggleStatus = async () => {
//     try {
//       setLoading(true);
//       const newStatus = !isAvailable;
//       await doctorAPI.updateStatus({ 
//         available: newStatus,
//         status: newStatus ? 'available' : 'break'
//       });
//       setIsAvailable(newStatus);
//     } catch (err) {
//       setError('Failed to update status: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Call next patient
//   const callNextPatient = async () => {
//     if (!isAvailable || patientQueue.length === 0) return;
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Call the API to get next patient
//       const response = await doctorAPI.callNext();
      
//       if (response.patient) {
//         // Load full patient details
//         const patientDetails = await doctorAPI.getPatient(response.patient.id);
//         setCurrentPatient(patientDetails);
//         setIsConsulting(true);
        
//         // Load patient medical files
//         try {
//           const allFiles = await doctorAPI.getPatientFiles(response.patient.id);
//           setPatientMedicalFiles(allFiles || []);
          
//           // Filter X-rays and Lab Tests
//           const xrays = (allFiles || []).filter(f => f.file_type === 'xray');
//           const labTests = (allFiles || []).filter(f => f.file_type === 'lab_test');
          
//           setXrayFiles(xrays);
//           setLabTestFiles(labTests);
          
//           // Set the most recent files for display
//           if (xrays.length > 0) {
//             setUploadedXray(xrays[0].url || xrays[0].file_url);
//           }
//           if (labTests.length > 0) {
//             setUploadedLab(labTests[0].url || labTests[0].file_url);
//           }
//         } catch (fileError) {
//           console.warn('Could not load patient files:', fileError);
//           // Continue anyway, files are optional
//         }
        
//         // Refresh queue
//         const updatedQueue = await doctorAPI.getQueue();
//         setPatientQueue(updatedQueue || []);
//       }
//     } catch (err) {
//       setError('Failed to call next patient: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Complete consultation
//   const handleCompleteConsultation = async () => {
//     if (!currentPatient) return;
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       const consultationData = {
//         diagnosis,
//         notes,
//         ai_evaluation: aiEvaluation,
//         xray_uploaded: !!uploadedXray,
//         lab_test_uploaded: !!uploadedLab,
//         symptoms: currentPatient.symptoms || '', // ✅ إضافة الأعراض
//         patient_id: currentPatient.id,
//         timestamp: new Date().toISOString()
//       };
      
//       // ✅ مسح localStorage
//       localStorage.removeItem('selectedDoctor');
//       localStorage.removeItem('currentPatient');
//       localStorage.removeItem('queueData');
      
//       await doctorAPI.completeConsultation(
//         currentPatient.queue_id || currentPatient.id,
//         consultationData
//       );
      
//       // Reset state
//       setIsConsulting(false);
//       setCurrentPatient(null);
//       setDiagnosis('');
//       setNotes('');
//       setAiEvaluation('');
//       setUploadedXray(null);
//       setUploadedLab(null);
//       setPatientMedicalFiles([]);
//       setXrayFiles([]);
//       setLabTestFiles([]);
      
//       // Refresh queue
//       const updatedQueue = await doctorAPI.getQueue();
//       setPatientQueue(updatedQueue || []);
      
//       alert('Consultation completed successfully!');
      
//       // ✅ العودة للصفحة الرئيسية
//       window.location.href = '/';
//     } catch (err) {
//       setError('Failed to complete consultation: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mark patient as no-show
//   const handleNoShow = async () => {
//     if (!currentPatient) return;
    
//     if (!window.confirm('❌ Mark this patient as no-show?')) return;
    
//     try {
//       setLoading(true);
      
//       // ✅ مسح localStorage
//       localStorage.removeItem('selectedDoctor');
//       localStorage.removeItem('currentPatient');
//       localStorage.removeItem('queueData');
      
//       await doctorAPI.markNoShow(currentPatient.queue_id || currentPatient.id);
      
//       // Reset state
//       setIsConsulting(false);
//       setCurrentPatient(null);
      
//       // Refresh queue
//       const updatedQueue = await doctorAPI.getQueue();
//       setPatientQueue(updatedQueue || []);
      
//       alert('Patient marked as no-show');
      
//       // ✅ العودة للصفحة الرئيسية
//       window.location.href = '/';
//     } catch (err) {
//       setError('Failed to mark no-show: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add note
//   const handleAddNote = async (noteText) => {
//     if (!currentPatient || !noteText.trim()) return;
    
//     try {
//       await doctorAPI.addNote({
//         patient_id: currentPatient.id,
//         note: noteText
//       });
//       alert('Note added successfully!');
//     } catch (err) {
//       setError('Failed to add note: ' + err.message);
//     }
//   };

//   // Delete medical file
//   const handleDeleteMedicalFile = async (fileId, fileType) => {
//     if (!window.confirm('Are you sure you want to delete this file?')) {
//       return;
//     }
    
//     try {
//       setLoading(true);
//       await doctorAPI.deleteMedicalFile(fileId);
      
//       // Update local state
//       setPatientMedicalFiles(prev => prev.filter(f => f.id !== fileId));
      
//       if (fileType === 'xray') {
//         setXrayFiles(prev => prev.filter(f => f.id !== fileId));
//         if (xrayFiles.length > 1) {
//           const nextFile = xrayFiles.find(f => f.id !== fileId);
//           setUploadedXray(nextFile?.url || nextFile?.file_url);
//         } else {
//           setUploadedXray(null);
//         }
//       } else if (fileType === 'lab_test') {
//         setLabTestFiles(prev => prev.filter(f => f.id !== fileId));
//         if (labTestFiles.length > 1) {
//           const nextFile = labTestFiles.find(f => f.id !== fileId);
//           setUploadedLab(nextFile?.url || nextFile?.file_url);
//         } else {
//           setUploadedLab(null);
//         }
//       }
      
//       alert('File deleted successfully!');
//     } catch (err) {
//       setError('Failed to delete file: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle file uploads
//   const handleXrayFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (file && currentPatient) {
//       try {
//         setLoading(true);
        
//         // Upload to API
//         const result = await doctorAPI.uploadMedicalFile({
//           file: file,
//           patientId: currentPatient.id,
//           fileType: 'xray',
//           title: `X-ray - ${new Date().toLocaleDateString()}`,
//           description: 'Uploaded during consultation',
//           doctorId: doctorProfile?.id
//         });
        
//         // Update local state
//         setUploadedXray(result.url || result.file_url || URL.createObjectURL(file));
//         setXrayFiles(prev => [result, ...prev]);
//         setShowXrayModal(true);
        
//         alert('X-ray uploaded successfully!');
//         event.target.value = null;
//       } catch (err) {
//         setError('Failed to upload X-ray: ' + err.message);
//       } finally {
//         setLoading(false);
//       }
//     } else if (file && !currentPatient) {
//       // Fallback for when no patient is selected
//       setUploadedXray(URL.createObjectURL(file));
//       setShowXrayModal(true);
//       event.target.value = null;
//     }
//   };

//   const handleLabTestFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (file && currentPatient) {
//       try {
//         setLoading(true);
        
//         // Upload to API
//         const result = await doctorAPI.uploadMedicalFile({
//           file: file,
//           patientId: currentPatient.id,
//           fileType: 'lab_test',
//           title: `Lab Test - ${new Date().toLocaleDateString()}`,
//           description: 'Uploaded during consultation',
//           doctorId: doctorProfile?.id
//         });
        
//         // Update local state
//         setUploadedLab(result.url || result.file_url || URL.createObjectURL(file));
//         setLabTestFiles(prev => [result, ...prev]);
//         setShowBloodTestModal(true);
        
//         alert('Lab test uploaded successfully!');
//         event.target.value = null;
//       } catch (err) {
//         setError('Failed to upload lab test: ' + err.message);
//       } finally {
//         setLoading(false);
//       }
//     } else if (file && !currentPatient) {
//       // Fallback for when no patient is selected
//       setUploadedLab(URL.createObjectURL(file));
//       setShowBloodTestModal(true);
//       event.target.value = null;
//     }
//   };

//   // Helper functions
//   const getSeverityClasses = (level) => {
//     switch (level) {
//       case 'high': return 'border-r-red-500 bg-red-50';
//       case 'medium': return 'border-r-orange-500 bg-orange-50';
//       case 'low': return 'border-r-green-500 bg-green-50';
//       default: return 'border-r-gray-300 bg-white';
//     }
//   };

//   const getSeverityBadgeClasses = (level) => {
//     switch (level) {
//       case 'high': return 'bg-red-500 text-white';
//       case 'medium': return 'bg-orange-500 text-white';
//       case 'low': return 'bg-green-500 text-white';
//       default: return 'bg-gray-500 text-white';
//     }
//   };

//   // Zoom and filter functions
//   const handleZoomIn = () => setXrayZoom(prev => prev + 0.2);
//   const handleZoomOut = () => xrayZoom > 0.4 && setXrayZoom(prev => prev - 0.2);
//   const handleResetZoom = () => {
//     setXrayZoom(1);
//     setXrayPosition({ x: 0, y: 0 });
//   };

//   const handleXrayMouseDown = (e) => {
//     setIsDraggingXray(true);
//     setXrayDragStart({
//       x: e.clientX - xrayPosition.x,
//       y: e.clientY - xrayPosition.y
//     });
//   };

//   const handleXrayMouseMove = (e) => {
//     if (!isDraggingXray) return;
//     setXrayPosition({
//       x: e.clientX - xrayDragStart.x,
//       y: e.clientY - xrayDragStart.y
//     });
//   };

//   const handleXrayMouseUp = () => {
//     setIsDraggingXray(false);
//   };

//   const handleLabZoomIn = () => setLabZoom(prev => prev + 0.2);
//   const handleLabZoomOut = () => labZoom > 0.4 && setLabZoom(prev => prev - 0.2);
//   const handleResetLabZoom = () => {
//     setLabZoom(1);
//     setLabPosition({ x: 0, y: 0 });
//   };

//   const handleLabMouseDown = (e) => {
//     setIsDraggingLab(true);
//     setLabDragStart({
//       x: e.clientX - labPosition.x,
//       y: e.clientY - labPosition.y
//     });
//   };

//   const handleLabMouseMove = (e) => {
//     if (!isDraggingLab) return;
//     setLabPosition({
//       x: e.clientX - labDragStart.x,
//       y: e.clientY - labDragStart.y
//     });
//   };

//   const handleLabMouseUp = () => {
//     setIsDraggingLab(false);
//   };

//   const getFilterStyle = () => {
//     switch (activeFilter) {
//       case 'contrast': return { filter: 'contrast(1.5)' };
//       case 'brightness': return { filter: 'brightness(1.3)' };
//       case 'sharpen': return { filter: 'contrast(1.2) brightness(1.1)' };
//       case 'grayscale': return { filter: 'grayscale(100%) contrast(1.2)' };
//       default: return { filter: 'none' };
//     }
//   };

//   const getLabFilterStyle = () => {
//     switch (activeLabFilter) {
//       case 'contrast': return { filter: 'contrast(1.5)' };
//       case 'brightness': return { filter: 'brightness(1.3)' };
//       case 'sharpen': return { filter: 'contrast(1.2) brightness(1.1)' };
//       case 'grayscale': return { filter: 'grayscale(100%) contrast(1.2)' };
//       default: return { filter: 'none' };
//     }
//   };

//   // Loading state
//   if (loading && !doctorProfile) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-slate-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="w-full mx-auto bg-[#e8f3f9] shadow-sm">
        
//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
//             <p className="font-bold">Error</p>
//             <p>{error}</p>
//             <button 
//               onClick={() => setError(null)}
//               className="mt-2 text-sm underline"
//             >
//               Dismiss
//             </button>
//           </div>
//         )}

//         {/* Header */}
//         <div className="bg-white border-b border-slate-200 p-4 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-[#2C5F8D]">
//               {doctorProfile?.name || 'Dr. Nada Elsalawy'}
//             </h1>
//             <p className="text-sm text-[#5B9BD5]">
//               {doctorProfile?.specialty || 'Dermatology'}
//             </p>
//             <p className="text-xs text-slate-500">
//               {doctorProfile?.room || 'Room 205 - 2nd Floor'}
//             </p>
//           </div>
//           <div className="flex gap-3 items-center">
//             <button className={`px-5 py-2 rounded-lg font-medium text-sm ${
//               !isAvailable 
//                 ? 'bg-gray-100 text-gray-600' 
//                 : (isConsulting ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600')
//             }`}>
//               Status: {!isAvailable ? 'Break' : (isConsulting ? 'Busy' : 'Available')}
//             </button>
//             <button 
//               onClick={toggleStatus} 
//               disabled={loading}
//               className="px-5 py-2 bg-azraq-400 hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-all disabled:opacity-50"
//             >
//               {loading ? 'Updating...' : (isAvailable ? 'Take Break' : 'Return to Work')}
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr]">
//           {/* Patient Queue Sidebar */}
//           <div className="bg-slate-50 border-l border-slate-200 lg:p-6 lg:sticky p-5 lg:top-0 lg:h-screen overflow-y-auto">
//             <div className="flex justify-between items-center mb-5">
//               <h2 className="text-xl font-bold text-slate-800">Patient Queue</h2>
//               <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
//                 {patientQueue.length} waiting
//               </span>
//             </div>
//             <div className="space-y-3">
//               {patientQueue.map((patient) => (
//                 <div 
//                   key={patient.id} 
//                   className={`bg-white p-4 rounded-xl border-r-4 cursor-pointer transition-all hover:-translate-x-1 hover:shadow-lg ${
//                     getSeverityClasses(patient.severityLevel || patient.severity_level)
//                   }`}
//                 >
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="font-bold text-slate-800">{patient.name}</span>
//                     <span className={`px-2 py-1 rounded-xl text-xs font-bold ${
//                       getSeverityBadgeClasses(patient.severityLevel || patient.severity_level)
//                     }`}>
//                       {patient.severity}/10
//                     </span>
//                   </div>
//                   <div className="text-sm text-slate-600">
//                     Wait time: {patient.waitTime || patient.wait_time || '~5 minutes'}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={callNextPatient}
//               disabled={!isAvailable || loading || patientQueue.length === 0}
//               className="w-full mt-5 py-4 bg-gradient-to-r from-azraq-400 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Loading...' : 'Call Next Patient'}
//             </button>
//           </div>

//           {/* Main Patient Panel */}
//           <div className="p-4 sm:p-6 lg:p-8 space-y-6">
//             {!isConsulting || !currentPatient ? (
//               <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
//                 <span className="text-8xl">🏥</span>
//                 <h2 className="text-2xl font-bold text-slate-500">No Active Patient</h2>
//                 <p>Select "Call Next Patient" from the queue to start.</p>
//               </div>
//             ) : (
//               <>
//                 {/* Patient Information */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-6">
//                   <h2 className="text-xl font-bold text-azraq-400 mb-5 flex items-center gap-3">
//                     👤 Patient Information
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="font-bold text-2xs text-slate-800 mb-1">Patient ID</div>
//                       <div className="text-lg font-semibold text-slate-500">
//                         {currentPatient.id || currentPatient.patient_id}
//                       </div>
//                     </div>
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="text-2xs font-bold text-slate-800 mb-1">Name</div>
//                       <div className="text-lg font-semibold text-slate-500">
//                         {currentPatient.name}
//                       </div>
//                     </div>
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="text-2xs font-bold text-slate-800 mb-1">National ID</div>
//                       <div className="text-lg font-semibold text-slate-500">
//                         {currentPatient.nationalId || currentPatient.national_id}
//                       </div>
//                     </div>
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="text-2xs font-bold text-slate-800 mb-1">Age / Gender</div>
//                       <div className="text-lg font-semibold text-slate-500">
//                         {currentPatient.age} years / {currentPatient.gender}
//                       </div>
//                     </div>
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="text-2xs font-bold text-slate-800 mb-1">Blood Type</div>
//                       <div className="text-lg font-semibold text-slate-500">
//                         {currentPatient.bloodType || currentPatient.blood_type}
//                       </div>
//                     </div>
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="text-2xs font-bold text-slate-800 mb-1">BMI</div>
//                       <div className="text-lg font-semibold text-slate-500">
//                         {currentPatient.bmi}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-red-50 p-4 rounded-xl">
//                       <p className="font-bold text-red-700 mb-2">⚠️ Chronic Diseases</p>
//                       <ul className="text-sm space-y-1">
//                         {(() => {
//                           const diseases = currentPatient.chronicDiseases || currentPatient.chronic_diseases;
//                           if (!diseases) return <li className="text-slate-500">None reported</li>;
//                           if (Array.isArray(diseases)) {
//                             return diseases.length > 0 
//                               ? diseases.map((disease, i) => <li key={i} className="text-slate-700">• {disease}</li>)
//                               : <li className="text-slate-500">None reported</li>;
//                           }
//                           if (typeof diseases === 'string' && diseases.trim()) {
//                             return <li className="text-slate-700">• {diseases}</li>;
//                           }
//                           return <li className="text-slate-500">None reported</li>;
//                         })()}
//                       </ul>
//                     </div>
//                     <div className="bg-orange-50 p-4 rounded-xl">
//                       <p className="font-bold text-orange-700 mb-2">🚫 Allergies</p>
//                       <ul className="text-sm space-y-1">
//                         {(() => {
//                           const allergies = currentPatient.allergies;
//                           if (!allergies) return <li className="text-slate-500">None reported</li>;
//                           if (Array.isArray(allergies)) {
//                             return allergies.length > 0
//                               ? allergies.map((allergy, i) => <li key={i} className="text-slate-700">• {allergy}</li>)
//                               : <li className="text-slate-500">None reported</li>;
//                           }
//                           if (typeof allergies === 'string' && allergies.trim()) {
//                             return <li className="text-slate-700">• {allergies}</li>;
//                           }
//                           return <li className="text-slate-500">None reported</li>;
//                         })()}
//                       </ul>
//                     </div>
//                     <div className="bg-green-50 p-4 rounded-xl">
//                       <p className="font-bold text-green-700 mb-2">💊 Current Medications</p>
//                       <ul className="text-sm space-y-1">
//                         {(() => {
//                           const medications = currentPatient.medications || currentPatient.current_medications;
//                           if (!medications) return <li className="text-slate-500">None reported</li>;
//                           if (Array.isArray(medications)) {
//                             return medications.length > 0
//                               ? medications.map((med, i) => <li key={i} className="text-slate-700">• {med}</li>)
//                               : <li className="text-slate-500">None reported</li>;
//                           }
//                           if (typeof medications === 'string' && medications.trim()) {
//                             return <li className="text-slate-700">• {medications}</li>;
//                           }
//                           return <li className="text-slate-500">None reported</li>;
//                         })()}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>

               
//                {/* AI Analysis Section in DoctorDashboard */}
// {/* AI Preliminary Analysis - الكود المحدث ليقرأ البيانات من ai_analysis */}
// <div className="bg-white border border-slate-200 rounded-xl p-6">
//   <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
//     🤖 AI Preliminary Analysis
//   </h2>
//   <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-500">
//     <div className="flex justify-between items-center mb-1">
//       <div className="font-bold text-blue-900">Reported Symptoms</div>
//     </div>
//     <p className='py-3'>
//       {/* عرض الأعراض التي تظهر في الصورة بالفعل */}
//       {currentPatient.symptoms || 'No symptoms reported'}
//     </p>
//     <div className="bg-white p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
//       <div>
//         <div className="text-2xs text-slate-600 mb-1">AI Diagnosis</div>
//         <div className="font-bold text-slate-800">
//           {/* التعديل: القراءة من ai_analysis.diagnosis التي تم حفظها في الشات بوت */}
//           {currentPatient.ai_analysis?.diagnosis || 'N/A'}
//         </div>
//       </div>
//       <div>
//         <div className="text-2xs text-slate-600 mb-1">Confidence Level</div>
//         <div className="font-bold text-slate-800">
//           {/* التعديل: القراءة من ai_analysis.confidence */}
//           {currentPatient.ai_analysis?.confidence 
//             ? `${currentPatient.ai_analysis.confidence}%` 
//             : 'N/A'}
//         </div>
//       </div>
//       <div>
//         <div className="text-2xs text-slate-600 mb-1">Recommended Department</div>
//         <div className="font-bold text-slate-800">
//           {/* التعديل: القراءة من ai_analysis.recommended_department */}
//           {currentPatient.ai_analysis?.recommended_department || 'N/A'}
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//                 {/* Treatment History */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-6">
//                   <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
//                     📋 Treatment History
//                   </h2>
//                   <div className="space-y-3">
//                     {(currentPatient.treatmentHistory || currentPatient.treatment_history || []).map((treatment, index) => (
//                       <div key={index} className="bg-slate-50 p-4 rounded-lg border-r-4 border-blue-500">
//                         <div className="flex justify-between items-center mb-2">
//                           <div className="font-bold text-slate-800">{treatment.condition}</div>
//                           <div className="text-sm text-slate-600">{treatment.date}</div>
//                         </div>
//                         <div className="text-sm text-slate-600">by {treatment.doctor}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Reports & Scans - ✅ يظهر فقط لو فيه ملفات */}
//                 {(xrayFiles.length > 0 || labTestFiles.length > 0) && (
//                   <div className="bg-white border border-slate-200 rounded-xl p-6">
//                     <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
//                       🔬 Reports & Scans
//                     </h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {/* X-ray - فقط لو موجود */}
//                       {xrayFiles.length > 0 && (
//                         <div 
//                           onClick={() => setShowXrayModal(true)} 
//                           className="bg-slate-50 rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-slate-200 hover:border-blue-500"
//                         >
//                           <div className="sm:h-48 h-39 bg-slate-900 flex items-center justify-center overflow-hidden">
//                             <img 
//                               src={xrayFiles[currentXrayIndex]?.url || xrayFiles[currentXrayIndex]?.file_url}
//                               alt="X-ray" 
//                               className="h-full w-full object-cover" 
//                             />
//                           </div>
//                           <div className="p-4 bg-white">
//                             <div className="flex justify-between items-center">
//                               <div className="font-bold text-slate-800 text-lg">X-ray</div>
//                               <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                                 {xrayFiles.length} file{xrayFiles.length > 1 ? 's' : ''}
//                               </span>
//                             </div>
//                             <div className="text-sm text-slate-600">Click to view details</div>
//                           </div>
//                         </div>
//                       )}
                      
//                       {/* Lab Test - فقط لو موجود */}
//                       {labTestFiles.length > 0 && (
//                         <div 
//                           onClick={() => setShowBloodTestModal(true)} 
//                           className="bg-slate-50 rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-slate-200 hover:border-blue-500"
//                         >
//                           <div className="sm:h-48 h-39 bg-slate-900 flex items-center justify-center overflow-hidden">
//                             <img 
//                               src={labTestFiles[currentLabIndex]?.url || labTestFiles[currentLabIndex]?.file_url}
//                               alt="Lab Test" 
//                               className="h-full w-full object-cover" 
//                             />
//                           </div>
//                           <div className="p-4 bg-white">
//                             <div className="flex justify-between items-center">
//                               <div className="font-bold text-slate-800 text-lg">Blood Test</div>
//                               <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                                 {labTestFiles.length} file{labTestFiles.length > 1 ? 's' : ''}
//                               </span>
//                             </div>
//                             <div className="text-sm text-slate-600">Click to view details</div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Quick Actions - ✅ دايماً موجود */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-6">
//                   <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
//                     ⚡ Quick Actions
//                   </h2>
//                   <input 
//                     type="file" 
//                     ref={xrayFileInputRef} 
//                     onChange={handleXrayFileChange} 
//                     accept="image/*" 
//                     className="hidden" 
//                   />
//                   <input 
//                     type="file" 
//                     ref={labTestFileInputRef} 
//                     onChange={handleLabTestFileChange} 
//                     accept="image/*" 
//                     className="hidden" 
//                   />
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <button 
//                       onClick={() => xrayFileInputRef.current.click()} 
//                       className="p-6 bg-gradient-to-r from-blue-400 to-azraq-400 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-3"
//                     >
//                       <span className="text-4xl">📷</span>
//                       <span className="font-bold text-lg">Analyze X-ray</span>
//                       <span className="text-sm opacity-90">Upload and analyze medical images</span>
//                     </button>
//                     <button 
//                       onClick={() => labTestFileInputRef.current.click()} 
//                       className="p-6 bg-gradient-to-r from-blue-400 to-azraq-400 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-3"
//                     >
//                       <span className="text-4xl">📋</span>
//                       <span className="font-bold text-lg">Review Lab Test</span>
//                       <span className="text-sm opacity-90">Upload and review lab results</span>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Complete Consultation */}
//                 <div className="bg-white rounded-xl p-6 shadow-lg border-t-2 border-b-2 border-t-azraq-400">
//                   <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
//                     ✍️ Complete Consultation
//                   </h2>
//                   <div className="bg-slate-50 p-5 rounded-xl space-y-5">
//                     <div>
//                       <label className="block font-bold text-slate-800 mb-2">Final Diagnosis:</label>
//                       <textarea 
//                         value={diagnosis}
//                         onChange={(e) => setDiagnosis(e.target.value)}
//                         className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none resize-y min-h-[100px]" 
//                         placeholder="Enter final diagnosis..." 
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-bold text-slate-800 mb-2">Doctor's Notes:</label>
//                       <textarea 
//                         value={notes}
//                         onChange={(e) => setNotes(e.target.value)}
//                         className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none resize-y min-h-[100px]" 
//                         placeholder="Enter additional notes..." 
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-bold text-slate-800 mb-3">AI Diagnosis Evaluation:</label>
//                       <div className="flex gap-5">
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <input 
//                             type="radio" 
//                             name="aiEvaluation" 
//                             value="agree"
//                             checked={aiEvaluation === 'agree'}
//                             onChange={(e) => setAiEvaluation(e.target.value)}
//                             className="w-5 h-5 text-green-500" 
//                           />
//                           <span className="text-slate-700 font-medium">Agree with AI</span>
//                         </label>
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <input 
//                             type="radio" 
//                             name="aiEvaluation" 
//                             value="disagree"
//                             checked={aiEvaluation === 'disagree'}
//                             onChange={(e) => setAiEvaluation(e.target.value)}
//                             className="w-5 h-5 text-red-500" 
//                           />
//                           <span className="text-slate-700 font-medium">Disagree with AI</span>
//                         </label>
//                       </div>
//                     </div>
//                     <div className="flex gap-3 pt-4">
//                       <button 
//                         onClick={handleCompleteConsultation}
//                         disabled={loading}
//                         className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
//                       >
//                         {loading ? 'Completing...' : '✅ Complete Consultation'}
//                       </button>
//                       <button 
//                         onClick={handleNoShow}
//                         disabled={loading}
//                         className="flex-1 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
//                       >
//                         {loading ? 'Marking...' : '❌ Mark No-Show'}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* X-ray Modal */}
//       {showXrayModal && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
//             <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
//               <div>
//                 <h3 className="text-xl font-bold">X-ray Analysis</h3>
//                 {xrayFiles.length > 0 && (
//                   <p className="text-sm text-slate-600">
//                     File {currentXrayIndex + 1} of {xrayFiles.length}
//                     {xrayFiles[currentXrayIndex]?.title && ` - ${xrayFiles[currentXrayIndex].title}`}
//                   </p>
//                 )}
//               </div>
//               <button 
//                 onClick={() => setShowXrayModal(false)}
//                 className="text-3xl hover:text-red-500"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="p-6">
//               <div className="flex gap-4 mb-4 flex-wrap">
//                 <button onClick={handleZoomIn} className="px-4 py-2 bg-blue-500 text-white rounded">Zoom In</button>
//                 <button onClick={handleZoomOut} className="px-4 py-2 bg-blue-500 text-white rounded">Zoom Out</button>
//                 <button onClick={handleResetZoom} className="px-4 py-2 bg-gray-500 text-white rounded">Reset</button>
//                 <select 
//                   value={activeFilter} 
//                   onChange={(e) => setActiveFilter(e.target.value)}
//                   className="px-4 py-2 border rounded"
//                 >
//                   <option value="normal">Normal</option>
//                   <option value="contrast">Contrast</option>
//                   <option value="brightness">Brightness</option>
//                   <option value="sharpen">Sharpen</option>
//                   <option value="grayscale">Grayscale</option>
//                 </select>
//                 {xrayFiles.length > 1 && (
//                   <>
//                     <button 
//                       onClick={() => setCurrentXrayIndex(prev => Math.max(0, prev - 1))}
//                       disabled={currentXrayIndex === 0}
//                       className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
//                     >
//                       ← Previous
//                     </button>
//                     <button 
//                       onClick={() => setCurrentXrayIndex(prev => Math.min(xrayFiles.length - 1, prev + 1))}
//                       disabled={currentXrayIndex === xrayFiles.length - 1}
//                       className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
//                     >
//                       Next →
//                     </button>
//                   </>
//                 )}
//                 {xrayFiles[currentXrayIndex]?.id && (
//                   <button 
//                     onClick={() => handleDeleteMedicalFile(xrayFiles[currentXrayIndex].id, 'xray')}
//                     className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                   >
//                     🗑️ Delete
//                   </button>
//                 )}
//               </div>
//               <div 
//                 className="overflow-hidden bg-black rounded-lg cursor-move"
//                 style={{ height: '600px' }}
//                 onMouseDown={handleXrayMouseDown}
//                 onMouseMove={handleXrayMouseMove}
//                 onMouseUp={handleXrayMouseUp}
//                 onMouseLeave={handleXrayMouseUp}
//               >
//                 <img 
//                   src={
//                     xrayFiles.length > 0 
//                       ? (xrayFiles[currentXrayIndex]?.url || xrayFiles[currentXrayIndex]?.file_url)
//                       : (uploadedXray || currentPatient?.xray || scan)
//                   }
//                   alt="X-ray"
//                   style={{
//                     transform: `translate(${xrayPosition.x}px, ${xrayPosition.y}px) scale(${xrayZoom})`,
//                     transformOrigin: 'center',
//                     transition: isDraggingXray ? 'none' : 'transform 0.2s',
//                     ...getFilterStyle()
//                   }}
//                   className="w-full h-full object-contain"
//                   draggable="false"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Lab Test Modal */}
//       {showBloodTestModal && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
//             <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
//               <div>
//                 <h3 className="text-xl font-bold">Blood Test Results</h3>
//                 {labTestFiles.length > 0 && (
//                   <p className="text-sm text-slate-600">
//                     File {currentLabIndex + 1} of {labTestFiles.length}
//                     {labTestFiles[currentLabIndex]?.title && ` - ${labTestFiles[currentLabIndex].title}`}
//                   </p>
//                 )}
//               </div>
//               <button 
//                 onClick={() => setShowBloodTestModal(false)}
//                 className="text-3xl hover:text-red-500"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="p-6">
//               <div className="flex gap-4 mb-4 flex-wrap">
//                 <button onClick={handleLabZoomIn} className="px-4 py-2 bg-blue-500 text-white rounded">Zoom In</button>
//                 <button onClick={handleLabZoomOut} className="px-4 py-2 bg-blue-500 text-white rounded">Zoom Out</button>
//                 <button onClick={handleResetLabZoom} className="px-4 py-2 bg-gray-500 text-white rounded">Reset</button>
//                 <select 
//                   value={activeLabFilter} 
//                   onChange={(e) => setActiveLabFilter(e.target.value)}
//                   className="px-4 py-2 border rounded"
//                 >
//                   <option value="normal">Normal</option>
//                   <option value="contrast">Contrast</option>
//                   <option value="brightness">Brightness</option>
//                   <option value="sharpen">Sharpen</option>
//                   <option value="grayscale">Grayscale</option>
//                 </select>
//                 {labTestFiles.length > 1 && (
//                   <>
//                     <button 
//                       onClick={() => setCurrentLabIndex(prev => Math.max(0, prev - 1))}
//                       disabled={currentLabIndex === 0}
//                       className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
//                     >
//                       ← Previous
//                     </button>
//                     <button 
//                       onClick={() => setCurrentLabIndex(prev => Math.min(labTestFiles.length - 1, prev + 1))}
//                       disabled={currentLabIndex === labTestFiles.length - 1}
//                       className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
//                     >
//                       Next →
//                     </button>
//                   </>
//                 )}
//                 {labTestFiles[currentLabIndex]?.id && (
//                   <button 
//                     onClick={() => handleDeleteMedicalFile(labTestFiles[currentLabIndex].id, 'lab_test')}
//                     className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                   >
//                     🗑️ Delete
//                   </button>
//                 )}
//               </div>
//               <div 
//                 className="overflow-hidden bg-black rounded-lg cursor-move"
//                 style={{ height: '600px' }}
//                 onMouseDown={handleLabMouseDown}
//                 onMouseMove={handleLabMouseMove}
//                 onMouseUp={handleLabMouseUp}
//                 onMouseLeave={handleLabMouseUp}
//               >
//                 <img 
//                   src={
//                     labTestFiles.length > 0 
//                       ? (labTestFiles[currentLabIndex]?.url || labTestFiles[currentLabIndex]?.file_url)
//                       : (uploadedLab || currentPatient?.labTest || currentPatient?.lab_test || lab)
//                   }
//                   alt="Lab Test"
//                   style={{
//                     transform: `translate(${labPosition.x}px, ${labPosition.y}px) scale(${labZoom})`,
//                     transformOrigin: 'center',
//                     transition: isDraggingLab ? 'none' : 'transform 0.2s',
//                     ...getLabFilterStyle()
//                   }}
//                   className="w-full h-full object-contain"
//                   draggable="false"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DoctorDashboard;

import React, { useState, useRef, useEffect } from 'react';
import doctorAPI from '../Services/DoctorServices';
// ❌ الصور الثابتة اتشالت - هنعرض الملفات من الـ API فقط

const DoctorDashboard = () => {
  // State
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showXrayModal, setShowXrayModal] = useState(false);
  const [showBloodTestModal, setShowBloodTestModal] = useState(false);
  const [xrayZoom, setXrayZoom] = useState(1);
  const [labZoom, setLabZoom] = useState(1);
  const [activeFilter, setActiveFilter] = useState('normal');
  const [activeLabFilter, setActiveLabFilter] = useState('normal');
  const [uploadedXray, setUploadedXray] = useState(null);
  const [uploadedLab, setUploadedLab] = useState(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Data
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [patientQueue, setPatientQueue] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [aiEvaluation, setAiEvaluation] = useState('');
  const [patientMedicalFiles, setPatientMedicalFiles] = useState([]);
  const [xrayFiles, setXrayFiles] = useState([]);
  const [labTestFiles, setLabTestFiles] = useState([]);

  // Drag state for X-ray
  const [xrayPosition, setXrayPosition] = useState({ x: 0, y: 0 });
  const [isDraggingXray, setIsDraggingXray] = useState(false);
  const [xrayDragStart, setXrayDragStart] = useState({ x: 0, y: 0 });

  // Drag state for Lab Test
  const [labPosition, setLabPosition] = useState({ x: 0, y: 0 });
  const [isDraggingLab, setIsDraggingLab] = useState(false);
  const [labDragStart, setLabDragStart] = useState({ x: 0, y: 0 });

  // File navigation
  const [currentXrayIndex, setCurrentXrayIndex] = useState(0);
  const [currentLabIndex, setCurrentLabIndex] = useState(0);

  const xrayFileInputRef = useRef(null);
  const labTestFileInputRef = useRef(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      // ✅ جلب بيانات الطبيب من localStorage (من ChatBot)
      const savedDoctor = localStorage.getItem('selectedDoctor');
      if (savedDoctor) {
        const doctorData = JSON.parse(savedDoctor);
        setDoctorProfile(doctorData);
      } else {
        // Fallback: Load from API
        const profile = await doctorAPI.getProfile();
        setDoctorProfile(profile);
      }

      // ✅ جلب بيانات المريض من localStorage (من ChatBot)
      const savedPatient = localStorage.getItem('currentPatient');
      if (savedPatient) {
        const patientData = JSON.parse(savedPatient);
        console.log('✅ Patient data loaded:', patientData);
        setCurrentPatient(patientData);
        setIsConsulting(true);
        
        // ✅ جلب الملفات الطبية من الـ API
        if (patientData.id) {
          try {
            const allFiles = await doctorAPI.getPatientFiles(patientData.id);
            if (allFiles && allFiles.files && Array.isArray(allFiles.files)) {
              setPatientMedicalFiles(allFiles.files);
              
              const xrays = allFiles.files.filter(f => f.file_type === 'xray');
              const labTests = allFiles.files.filter(f => f.file_type === 'lab_test');
              
              setXrayFiles(xrays);
              setLabTestFiles(labTests);
              
              if (xrays.length > 0) {
                setUploadedXray(xrays[0].url || xrays[0].file_url);
              }
              if (labTests.length > 0) {
                setUploadedLab(labTests[0].url || labTests[0].file_url);
              }
            }
          } catch (fileError) {
            console.warn('⚠️ Could not load patient files:', fileError);
          }
        }
        
        // Queue فاضية لأننا جايين من ChatBot مباشرة
        setPatientQueue([]);
      } else {
        // Fallback: Load queue from API
        const queue = await doctorAPI.getQueue();
        setPatientQueue(queue || []);
      }
    } catch (err) {
      setError('Failed to load data: ' + err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle doctor status
  const toggleStatus = async () => {
    try {
      setLoading(true);
      const newStatus = !isAvailable;
      await doctorAPI.updateStatus({ 
        available: newStatus,
        status: newStatus ? 'available' : 'break'
      });
      setIsAvailable(newStatus);
    } catch (err) {
      setError('Failed to update status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Call next patient
  const callNextPatient = async () => {
    if (!isAvailable || patientQueue.length === 0) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to get next patient
      const response = await doctorAPI.callNext();
      
      if (response.patient) {
        // Load full patient details
        const patientDetails = await doctorAPI.getPatient(response.patient.id);
        setCurrentPatient(patientDetails);
        setIsConsulting(true);
        
        // Load patient medical files
        try {
          const allFiles = await doctorAPI.getPatientFiles(response.patient.id);
          setPatientMedicalFiles(allFiles || []);
          
          // Filter X-rays and Lab Tests
          const xrays = (allFiles || []).filter(f => f.file_type === 'xray');
          const labTests = (allFiles || []).filter(f => f.file_type === 'lab_test');
          
          setXrayFiles(xrays);
          setLabTestFiles(labTests);
          
          // Set the most recent files for display
          if (xrays.length > 0) {
            setUploadedXray(xrays[0].url || xrays[0].file_url);
          }
          if (labTests.length > 0) {
            setUploadedLab(labTests[0].url || labTests[0].file_url);
          }
        } catch (fileError) {
          console.warn('Could not load patient files:', fileError);
          // Continue anyway, files are optional
        }
        
        // Refresh queue
        const updatedQueue = await doctorAPI.getQueue();
        setPatientQueue(updatedQueue || []);
      }
    } catch (err) {
      setError('Failed to call next patient: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Complete consultation
  const handleCompleteConsultation = async () => {
    if (!currentPatient) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const consultationData = {
        diagnosis,
        notes,
        ai_evaluation: aiEvaluation,
        xray_uploaded: !!uploadedXray,
        lab_test_uploaded: !!uploadedLab,
        symptoms: currentPatient.symptoms || '', // ✅ إضافة الأعراض
        patient_id: currentPatient.id,
        timestamp: new Date().toISOString()
      };
      
      // ✅ مسح localStorage
      localStorage.removeItem('selectedDoctor');
      localStorage.removeItem('currentPatient');
      localStorage.removeItem('queueData');
      
      await doctorAPI.completeConsultation(
        currentPatient.queue_id || currentPatient.id,
        consultationData
      );
      
      // Reset state
      setIsConsulting(false);
      setCurrentPatient(null);
      setDiagnosis('');
      setNotes('');
      setAiEvaluation('');
      setUploadedXray(null);
      setUploadedLab(null);
      setPatientMedicalFiles([]);
      setXrayFiles([]);
      setLabTestFiles([]);
      
      // Refresh queue
      const updatedQueue = await doctorAPI.getQueue();
      setPatientQueue(updatedQueue || []);
      
      alert('Consultation completed successfully!');
      
      // ✅ العودة للصفحة الرئيسية
      window.location.href = '/';
    } catch (err) {
      setError('Failed to complete consultation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mark patient as no-show
  const handleNoShow = async () => {
    if (!currentPatient) return;
    
    if (!window.confirm('❌ Mark this patient as no-show?')) return;
    
    try {
      setLoading(true);
      
      // ✅ مسح localStorage
      localStorage.removeItem('selectedDoctor');
      localStorage.removeItem('currentPatient');
      localStorage.removeItem('queueData');
      
      await doctorAPI.markNoShow(currentPatient.queue_id || currentPatient.id);
      
      // Reset state
      setIsConsulting(false);
      setCurrentPatient(null);
      
      // Refresh queue
      const updatedQueue = await doctorAPI.getQueue();
      setPatientQueue(updatedQueue || []);
      
      alert('Patient marked as no-show');
      
      // ✅ العودة للصفحة الرئيسية
      window.location.href = '/';
    } catch (err) {
      setError('Failed to mark no-show: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add note
  const handleAddNote = async (noteText) => {
    if (!currentPatient || !noteText.trim()) return;
    
    try {
      await doctorAPI.addNote({
        patient_id: currentPatient.id,
        note: noteText
      });
      alert('Note added successfully!');
    } catch (err) {
      setError('Failed to add note: ' + err.message);
    }
  };

  // Delete medical file
  const handleDeleteMedicalFile = async (fileId, fileType) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }
    
    try {
      setLoading(true);
      await doctorAPI.deleteMedicalFile(fileId);
      
      // Update local state
      setPatientMedicalFiles(prev => prev.filter(f => f.id !== fileId));
      
      if (fileType === 'xray') {
        setXrayFiles(prev => prev.filter(f => f.id !== fileId));
        if (xrayFiles.length > 1) {
          const nextFile = xrayFiles.find(f => f.id !== fileId);
          setUploadedXray(nextFile?.url || nextFile?.file_url);
        } else {
          setUploadedXray(null);
        }
      } else if (fileType === 'lab_test') {
        setLabTestFiles(prev => prev.filter(f => f.id !== fileId));
        if (labTestFiles.length > 1) {
          const nextFile = labTestFiles.find(f => f.id !== fileId);
          setUploadedLab(nextFile?.url || nextFile?.file_url);
        } else {
          setUploadedLab(null);
        }
      }
      
      alert('File deleted successfully!');
    } catch (err) {
      setError('Failed to delete file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle file uploads
  const handleXrayFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file && currentPatient) {
      try {
        setLoading(true);
        
        // Upload to API
        const result = await doctorAPI.uploadMedicalFile({
          file: file,
          patientId: currentPatient.id,
          fileType: 'xray',
          title: `X-ray - ${new Date().toLocaleDateString()}`,
          description: 'Uploaded during consultation',
          doctorId: doctorProfile?.id
        });
        
        // Update local state
        setUploadedXray(result.url || result.file_url || URL.createObjectURL(file));
        setXrayFiles(prev => [result, ...prev]);
        setShowXrayModal(true);
        
        alert('X-ray uploaded successfully!');
        event.target.value = null;
      } catch (err) {
        setError('Failed to upload X-ray: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else if (file && !currentPatient) {
      // Fallback for when no patient is selected
      setUploadedXray(URL.createObjectURL(file));
      setShowXrayModal(true);
      event.target.value = null;
    }
  };

  const handleLabTestFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file && currentPatient) {
      try {
        setLoading(true);
        
        // Upload to API
        const result = await doctorAPI.uploadMedicalFile({
          file: file,
          patientId: currentPatient.id,
          fileType: 'lab_test',
          title: `Lab Test - ${new Date().toLocaleDateString()}`,
          description: 'Uploaded during consultation',
          doctorId: doctorProfile?.id
        });
        
        // Update local state
        setUploadedLab(result.url || result.file_url || URL.createObjectURL(file));
        setLabTestFiles(prev => [result, ...prev]);
        setShowBloodTestModal(true);
        
        alert('Lab test uploaded successfully!');
        event.target.value = null;
      } catch (err) {
        setError('Failed to upload lab test: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else if (file && !currentPatient) {
      // Fallback for when no patient is selected
      setUploadedLab(URL.createObjectURL(file));
      setShowBloodTestModal(true);
      event.target.value = null;
    }
  };

  // Helper functions
  const getSeverityClasses = (level) => {
    switch (level) {
      case 'high': return 'border-r-red-500 bg-red-50';
      case 'medium': return 'border-r-orange-500 bg-orange-50';
      case 'low': return 'border-r-green-500 bg-green-50';
      default: return 'border-r-gray-300 bg-white';
    }
  };

  const getSeverityBadgeClasses = (level) => {
    switch (level) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Zoom and filter functions
  const handleZoomIn = () => setXrayZoom(prev => prev + 0.2);
  const handleZoomOut = () => xrayZoom > 0.4 && setXrayZoom(prev => prev - 0.2);
  const handleResetZoom = () => {
    setXrayZoom(1);
    setXrayPosition({ x: 0, y: 0 });
  };

  const handleXrayMouseDown = (e) => {
    setIsDraggingXray(true);
    setXrayDragStart({
      x: e.clientX - xrayPosition.x,
      y: e.clientY - xrayPosition.y
    });
  };

  const handleXrayMouseMove = (e) => {
    if (!isDraggingXray) return;
    setXrayPosition({
      x: e.clientX - xrayDragStart.x,
      y: e.clientY - xrayDragStart.y
    });
  };

  const handleXrayMouseUp = () => {
    setIsDraggingXray(false);
  };

  const handleLabZoomIn = () => setLabZoom(prev => prev + 0.2);
  const handleLabZoomOut = () => labZoom > 0.4 && setLabZoom(prev => prev - 0.2);
  const handleResetLabZoom = () => {
    setLabZoom(1);
    setLabPosition({ x: 0, y: 0 });
  };

  const handleLabMouseDown = (e) => {
    setIsDraggingLab(true);
    setLabDragStart({
      x: e.clientX - labPosition.x,
      y: e.clientY - labPosition.y
    });
  };

  const handleLabMouseMove = (e) => {
    if (!isDraggingLab) return;
    setLabPosition({
      x: e.clientX - labDragStart.x,
      y: e.clientY - labDragStart.y
    });
  };

  const handleLabMouseUp = () => {
    setIsDraggingLab(false);
  };

  const getFilterStyle = () => {
    switch (activeFilter) {
      case 'contrast': return { filter: 'contrast(1.5)' };
      case 'brightness': return { filter: 'brightness(1.3)' };
      case 'sharpen': return { filter: 'contrast(1.2) brightness(1.1)' };
      case 'grayscale': return { filter: 'grayscale(100%) contrast(1.2)' };
      default: return { filter: 'none' };
    }
  };

  const getLabFilterStyle = () => {
    switch (activeLabFilter) {
      case 'contrast': return { filter: 'contrast(1.5)' };
      case 'brightness': return { filter: 'brightness(1.3)' };
      case 'sharpen': return { filter: 'contrast(1.2) brightness(1.1)' };
      case 'grayscale': return { filter: 'grayscale(100%) contrast(1.2)' };
      default: return { filter: 'none' };
    }
  };

  // Loading state
  if (loading && !doctorProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full mx-auto bg-[#e8f3f9] shadow-sm">
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#2C5F8D]">
              {doctorProfile?.name || 'Dr. Nada Elsalawy'}
            </h1>
            <p className="text-sm text-[#5B9BD5]">
              {doctorProfile?.specialty || 'Dermatology'}
            </p>
            <p className="text-xs text-slate-500">
              {doctorProfile?.room || 'Room 205 - 2nd Floor'}
            </p>
          </div>
          <div className="flex gap-3 items-center max-sm:justify-between">
            <button className={`px-5 py-2 rounded-lg font-medium text-sm ${
              !isAvailable 
                ? 'bg-gray-100 text-gray-600' 
                : (isConsulting ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600')
            }`}>
              Status: {!isAvailable ? 'Break' : (isConsulting ? 'Busy' : 'Available')}
            </button>
            <button 
              onClick={toggleStatus} 
              disabled={loading}
              className="px-5 py-2 bg-azraq-400 hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : (isAvailable ? 'Take Break' : 'Return to Work')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr]">
          {/* Patient Queue Sidebar */}
          <div className="bg-slate-50 border-l border-slate-200 lg:p-6 lg:sticky p-5 lg:top-0 lg:h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-800">Patient Queue</h2>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {patientQueue.length} waiting
              </span>
            </div>
            <div className="space-y-3">
              {patientQueue.map((patient) => (
                <div 
                  key={patient.id} 
                  className={`bg-white p-4 rounded-xl border-r-4 cursor-pointer transition-all hover:-translate-x-1 hover:shadow-lg ${
                    getSeverityClasses(patient.severityLevel || patient.severity_level)
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800">{patient.name}</span>
                    <span className={`px-2 py-1 rounded-xl text-xs font-bold ${
                      getSeverityBadgeClasses(patient.severityLevel || patient.severity_level)
                    }`}>
                      {patient.severity}/10
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">
                    Wait time: {patient.waitTime || patient.wait_time || '~5 minutes'}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={callNextPatient}
              disabled={!isAvailable || loading || patientQueue.length === 0}
              className="w-full mt-5 py-4 bg-gradient-to-r from-azraq-400 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Call Next Patient'}
            </button>
          </div>

          {/* Main Patient Panel */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {!isConsulting || !currentPatient ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                <span className="text-8xl">🏥</span>
                <h2 className="text-2xl font-bold text-slate-500">No Active Patient</h2>
                <p>Select "Call Next Patient" from the queue to start.</p>
              </div>
            ) : (
              <>
                {/* Patient Information */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-azraq-400 mb-5 flex items-center gap-3">
                    👤 Patient Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="font-bold text-2xs text-slate-800 mb-1">Patient ID</div>
                      <div className="text-lg font-semibold text-slate-500">
                        {currentPatient.id || currentPatient.patient_id}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="text-2xs font-bold text-slate-800 mb-1">Name</div>
                      <div className="text-lg font-semibold text-slate-500">
                        {currentPatient.name}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="text-2xs font-bold text-slate-800 mb-1">National ID</div>
                      <div className="text-lg font-semibold text-slate-500">
                        {currentPatient.nationalId || currentPatient.national_id}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="text-2xs font-bold text-slate-800 mb-1">Age / Gender</div>
                      <div className="text-lg font-semibold text-slate-500">
                        {currentPatient.age} years / {currentPatient.gender}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="text-2xs font-bold text-slate-800 mb-1">Blood Type</div>
                      <div className="text-lg font-semibold text-slate-500">
                        {currentPatient.bloodType || currentPatient.blood_type}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="text-2xs font-bold text-slate-800 mb-1">BMI</div>
                      <div className="text-lg font-semibold text-slate-500">
                        {currentPatient.bmi}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 p-4 rounded-xl">
                      <p className="font-bold text-red-700 mb-2">⚠️ Chronic Diseases</p>
                      <ul className="text-sm space-y-1">
                        {(() => {
                          const diseases = currentPatient.chronicDiseases || currentPatient.chronic_diseases;
                          if (!diseases) return <li className="text-slate-500">None reported</li>;
                          if (Array.isArray(diseases)) {
                            return diseases.length > 0 
                              ? diseases.map((disease, i) => <li key={i} className="text-slate-700">• {disease}</li>)
                              : <li className="text-slate-500">None reported</li>;
                          }
                          if (typeof diseases === 'string' && diseases.trim()) {
                            return <li className="text-slate-700">• {diseases}</li>;
                          }
                          return <li className="text-slate-500">None reported</li>;
                        })()}
                      </ul>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <p className="font-bold text-orange-700 mb-2">🚫 Allergies</p>
                      <ul className="text-sm space-y-1">
                        {(() => {
                          const allergies = currentPatient.allergies;
                          if (!allergies) return <li className="text-slate-500">None reported</li>;
                          if (Array.isArray(allergies)) {
                            return allergies.length > 0
                              ? allergies.map((allergy, i) => <li key={i} className="text-slate-700">• {allergy}</li>)
                              : <li className="text-slate-500">None reported</li>;
                          }
                          if (typeof allergies === 'string' && allergies.trim()) {
                            return <li className="text-slate-700">• {allergies}</li>;
                          }
                          return <li className="text-slate-500">None reported</li>;
                        })()}
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <p className="font-bold text-green-700 mb-2">💊 Current Medications</p>
                      <ul className="text-sm space-y-1">
                        {(() => {
                          const medications = currentPatient.medications || currentPatient.current_medications;
                          if (!medications) return <li className="text-slate-500">None reported</li>;
                          if (Array.isArray(medications)) {
                            return medications.length > 0
                              ? medications.map((med, i) => <li key={i} className="text-slate-700">• {med}</li>)
                              : <li className="text-slate-500">None reported</li>;
                          }
                          if (typeof medications === 'string' && medications.trim()) {
                            return <li className="text-slate-700">• {medications}</li>;
                          }
                          return <li className="text-slate-500">None reported</li>;
                        })()}
                      </ul>
                    </div>
                  </div>
                </div>

               
               {/* AI Analysis Section in DoctorDashboard */}
{/* AI Preliminary Analysis Section */}
<div className="bg-white border border-slate-200 rounded-xl p-6">
  <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
    🤖 AI Preliminary Analysis
  </h2>
  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-500">
    <div className="flex justify-between items-center mb-1">
      <div className="font-bold text-blue-900">Reported Symptoms</div>
    </div>
    <p className='py-3'>
      {currentPatient.symptoms || 'No symptoms reported'}
    </p>
    <div className="bg-white p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <div className="text-2xs text-slate-600 mb-1">AI Diagnosis</div>
        <div className="font-bold text-slate-800">
          {/* ✅ قراءة من المصادر المختلفة حسب المتاح */}
          {currentPatient.ai_analysis?.diagnosis || 
           currentPatient.assessment?.preliminary_diagnosis || 
           'N/A'}
        </div>
      </div>
      <div>
        <div className="text-2xs text-slate-600 mb-1">Confidence Level</div>
        <div className="font-bold text-slate-800">
          {/* ✅ قراءة من ai_analysis أو من assessment.severity */}
          {currentPatient.ai_analysis?.confidence 
            ? `${currentPatient.ai_analysis.confidence}%` 
            : currentPatient.assessment?.severity?.level 
              ? `${currentPatient.assessment.severity.level * 10}%`
              : 'N/A'}
        </div>
      </div>
      <div>
        <div className="text-2xs text-slate-600 mb-1">Recommended Department</div>
        <div className="font-bold text-slate-800">
          {/* ✅ قراءة من ai_analysis أو من assessment.specialty_required */}
          {currentPatient.ai_analysis?.recommended_department || 
           currentPatient.assessment?.specialty_required || 
           'N/A'}
        </div>
      </div>
    </div>
  </div>
</div>

                {/* Treatment History */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
                    📋 Treatment History
                  </h2>
                  <div className="space-y-3">
                    {(currentPatient.treatmentHistory || currentPatient.treatment_history || []).map((treatment, index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-lg border-r-4 border-blue-500">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-bold text-slate-800">{treatment.condition}</div>
                          <div className="text-sm text-slate-600">{treatment.date}</div>
                        </div>
                        <div className="text-sm text-slate-600">by {treatment.doctor}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reports & Scans - ✅ يظهر فقط لو فيه ملفات */}
                {(xrayFiles.length > 0 || labTestFiles.length > 0) && (
                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
                      🔬 Reports & Scans
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* X-ray - فقط لو موجود */}
                      {xrayFiles.length > 0 && (
                        <div 
                          onClick={() => setShowXrayModal(true)} 
                          className="bg-slate-50 rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-slate-200 hover:border-blue-500"
                        >
                          <div className="sm:h-48 h-39 bg-slate-900 flex items-center justify-center overflow-hidden">
                            <img 
                              src={xrayFiles[currentXrayIndex]?.url || xrayFiles[currentXrayIndex]?.file_url}
                              alt="X-ray" 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div className="p-4 bg-white">
                            <div className="flex justify-between items-center">
                              <div className="font-bold text-slate-800 text-lg">X-ray</div>
                              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                {xrayFiles.length} file{xrayFiles.length > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="text-sm text-slate-600">Click to view details</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Lab Test - فقط لو موجود */}
                      {labTestFiles.length > 0 && (
                        <div 
                          onClick={() => setShowBloodTestModal(true)} 
                          className="bg-slate-50 rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-slate-200 hover:border-blue-500"
                        >
                          <div className="sm:h-48 h-39 bg-slate-900 flex items-center justify-center overflow-hidden">
                            <img 
                              src={labTestFiles[currentLabIndex]?.url || labTestFiles[currentLabIndex]?.file_url}
                              alt="Lab Test" 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div className="p-4 bg-white">
                            <div className="flex justify-between items-center">
                              <div className="font-bold text-slate-800 text-lg">Blood Test</div>
                              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                {labTestFiles.length} file{labTestFiles.length > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="text-sm text-slate-600">Click to view details</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Actions - ✅ دايماً موجود */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
                    ⚡ Quick Actions
                  </h2>
                  <input 
                    type="file" 
                    ref={xrayFileInputRef} 
                    onChange={handleXrayFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <input 
                    type="file" 
                    ref={labTestFileInputRef} 
                    onChange={handleLabTestFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => xrayFileInputRef.current.click()} 
                      className="p-6 bg-gradient-to-r from-blue-400 to-azraq-400 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-3"
                    >
                      <span className="text-4xl">📷</span>
                      <span className="font-bold text-lg">Analyze X-ray</span>
                      <span className="text-sm opacity-90">Upload and analyze medical images</span>
                    </button>
                    <button 
                      onClick={() => labTestFileInputRef.current.click()} 
                      className="p-6 bg-gradient-to-r from-blue-400 to-azraq-400 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-3"
                    >
                      <span className="text-4xl">📋</span>
                      <span className="font-bold text-lg">Review Lab Test</span>
                      <span className="text-sm opacity-90">Upload and review lab results</span>
                    </button>
                  </div>
                </div>

                {/* Complete Consultation */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-t-2 border-b-2 border-t-azraq-400">
                  <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
                    ✍️ Complete Consultation
                  </h2>
                  <div className="bg-slate-50 p-5 rounded-xl space-y-5">
                    <div>
                      <label className="block font-bold text-slate-800 mb-2">Final Diagnosis:</label>
                      <textarea 
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none resize-y min-h-[100px]" 
                        placeholder="Enter final diagnosis..." 
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-2">Doctor's Notes:</label>
                      <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none resize-y min-h-[100px]" 
                        placeholder="Enter additional notes..." 
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-3">AI Diagnosis Evaluation:</label>
                      <div className="flex gap-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="aiEvaluation" 
                            value="agree"
                            checked={aiEvaluation === 'agree'}
                            onChange={(e) => setAiEvaluation(e.target.value)}
                            className="w-5 h-5 text-green-500" 
                          />
                          <span className="text-slate-700 font-medium">Agree with AI</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="aiEvaluation" 
                            value="disagree"
                            checked={aiEvaluation === 'disagree'}
                            onChange={(e) => setAiEvaluation(e.target.value)}
                            className="w-5 h-5 text-red-500" 
                          />
                          <span className="text-slate-700 font-medium">Disagree with AI</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={handleCompleteConsultation}
                        disabled={loading}
                        className="max-sm:px-0.5 flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
                      >
                        {loading ? 'Completing...' : ' Complete Consultation'}
                      </button>
                      <button 
                        onClick={handleNoShow}
                        disabled={loading}
                        className="max-sm:px-0.5 flex-1 py-4 bg-gradient-to-r from-red-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
                      >
                        {loading ? 'Marking...' : ' Mark No-Show'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* X-ray Modal */}
      {showXrayModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <div>
                <h3 className="text-xl font-bold">X-ray Analysis</h3>
                {xrayFiles.length > 0 && (
                  <p className="text-sm text-slate-600">
                    File {currentXrayIndex + 1} of {xrayFiles.length}
                    {xrayFiles[currentXrayIndex]?.title && ` - ${xrayFiles[currentXrayIndex].title}`}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setShowXrayModal(false)}
                className="text-3xl hover:text-red-500"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-4 mb-4 flex-wrap">
                <button onClick={handleZoomIn} className="px-4 py-2 bg-blue-500 text-white rounded">Zoom In</button>
                <button onClick={handleZoomOut} className="px-4 py-2 bg-blue-500 text-white rounded">Zoom Out</button>
                <button onClick={handleResetZoom} className="px-4 py-2 bg-gray-500 text-white rounded">Reset</button>
                <select 
                  value={activeFilter} 
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="px-4 py-2 border rounded"
                >
                  <option value="normal">Normal</option>
                  <option value="contrast">Contrast</option>
                  <option value="brightness">Brightness</option>
                  <option value="sharpen">Sharpen</option>
                  <option value="grayscale">Grayscale</option>
                </select>
                {xrayFiles.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentXrayIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentXrayIndex === 0}
                      className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                      ← Previous
                    </button>
                    <button 
                      onClick={() => setCurrentXrayIndex(prev => Math.min(xrayFiles.length - 1, prev + 1))}
                      disabled={currentXrayIndex === xrayFiles.length - 1}
                      className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                      Next →
                    </button>
                  </>
                )}
                {xrayFiles[currentXrayIndex]?.id && (
                  <button 
                    onClick={() => handleDeleteMedicalFile(xrayFiles[currentXrayIndex].id, 'xray')}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
              <div 
                className="overflow-hidden bg-black rounded-lg cursor-move"
                style={{ height: '600px' }}
                onMouseDown={handleXrayMouseDown}
                onMouseMove={handleXrayMouseMove}
                onMouseUp={handleXrayMouseUp}
                onMouseLeave={handleXrayMouseUp}
              >
                <img 
                  src={
                    xrayFiles.length > 0 
                      ? (xrayFiles[currentXrayIndex]?.url || xrayFiles[currentXrayIndex]?.file_url)
                      : (uploadedXray || currentPatient?.xray || scan)
                  }
                  alt="X-ray"
                  style={{
                    transform: `translate(${xrayPosition.x}px, ${xrayPosition.y}px) scale(${xrayZoom})`,
                    transformOrigin: 'center',
                    transition: isDraggingXray ? 'none' : 'transform 0.2s',
                    ...getFilterStyle()
                  }}
                  className="w-full h-full object-contain"
                  draggable="false"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lab Test Modal */}
      {showBloodTestModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <div>
                <h3 className="text-xl font-bold">Blood Test Results</h3>
                {labTestFiles.length > 0 && (
                  <p className="text-sm text-slate-600">
                    File {currentLabIndex + 1} of {labTestFiles.length}
                    {labTestFiles[currentLabIndex]?.title && ` - ${labTestFiles[currentLabIndex].title}`}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setShowBloodTestModal(false)}
                className="text-3xl hover:text-red-500"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-4 mb-4 flex-wrap">
                <button onClick={handleLabZoomIn} className="px-4 py-2 bg-blue-500 text-white rounded">Zoom In</button>
                <button onClick={handleLabZoomOut} className="px-4 py-2 bg-blue-500 text-white rounded">Zoom Out</button>
                <button onClick={handleResetLabZoom} className="px-4 py-2 bg-gray-500 text-white rounded">Reset</button>
                <select 
                  value={activeLabFilter} 
                  onChange={(e) => setActiveLabFilter(e.target.value)}
                  className="px-4 py-2 border rounded"
                >
                  <option value="normal">Normal</option>
                  <option value="contrast">Contrast</option>
                  <option value="brightness">Brightness</option>
                  <option value="sharpen">Sharpen</option>
                  <option value="grayscale">Grayscale</option>
                </select>
                {labTestFiles.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentLabIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentLabIndex === 0}
                      className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                      ← Previous
                    </button>
                    <button 
                      onClick={() => setCurrentLabIndex(prev => Math.min(labTestFiles.length - 1, prev + 1))}
                      disabled={currentLabIndex === labTestFiles.length - 1}
                      className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                      Next →
                    </button>
                  </>
                )}
                {labTestFiles[currentLabIndex]?.id && (
                  <button 
                    onClick={() => handleDeleteMedicalFile(labTestFiles[currentLabIndex].id, 'lab_test')}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
              <div 
                className="overflow-hidden bg-black rounded-lg cursor-move"
                style={{ height: '600px' }}
                onMouseDown={handleLabMouseDown}
                onMouseMove={handleLabMouseMove}
                onMouseUp={handleLabMouseUp}
                onMouseLeave={handleLabMouseUp}
              >
                <img 
                  src={
                    labTestFiles.length > 0 
                      ? (labTestFiles[currentLabIndex]?.url || labTestFiles[currentLabIndex]?.file_url)
                      : (uploadedLab || currentPatient?.labTest || currentPatient?.lab_test || lab)
                  }
                  alt="Lab Test"
                  style={{
                    transform: `translate(${labPosition.x}px, ${labPosition.y}px) scale(${labZoom})`,
                    transformOrigin: 'center',
                    transition: isDraggingLab ? 'none' : 'transform 0.2s',
                    ...getLabFilterStyle()
                  }}
                  className="w-full h-full object-contain"
                  draggable="false"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;