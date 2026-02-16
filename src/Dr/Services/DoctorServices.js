// // // Doctor API Service
// // const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

// // class DoctorAPI {
// //   constructor() {
// //     this.baseURL = BASE_URL;
// //   }

// //   // Helper method for making requests
// //   async request(endpoint, options = {}) {
// //     const url = `${this.baseURL}${endpoint}`;
// //     const config = {
// //       ...options,
// //       headers: {
// //         'Content-Type': 'application/json',
// //         ...options.headers,
// //       },
// //     };

// //     try {
// //       const response = await fetch(url, config);
      
// //       if (!response.ok) {
// //         const error = await response.json().catch(() => ({}));
// //         throw new Error(error.message || `HTTP error! status: ${response.status}`);
// //       }
      
// //       return await response.json();
// //     } catch (error) {
// //       console.error('API Request Error:', error);
// //       throw error;
// //     }
// //   }

// //   // GET /doctor/profile - Get Profile
// //   async getProfile() {
// //     return this.request('/doctor/profile', {
// //       method: 'GET',
// //     });
// //   }

// //   // PUT /doctor/profile - Update Profile
// //   async updateProfile(profileData) {
// //     return this.request('/doctor/profile', {
// //       method: 'PUT',
// //       body: JSON.stringify(profileData),
// //     });
// //   }

// //   // PUT /doctor/status - Update Status
// //   async updateStatus(statusData) {
// //     return this.request('/doctor/status', {
// //       method: 'PUT',
// //       body: JSON.stringify(statusData),
// //     });
// //   }

// //   // GET /doctor/queue - Get Queue
// //   async getQueue() {
// //     return this.request('/doctor/queue', {
// //       method: 'GET',
// //     });
// //   }

// //   // POST /doctor/queue/next - Call Next
// //   async callNext() {
// //     return this.request('/doctor/queue/next', {
// //       method: 'POST',
// //     });
// //   }

// //   // POST /doctor/queue/{queue_id}/complete - Complete
// //   async completeConsultation(queueId, consultationData) {
// //     return this.request(`/doctor/queue/${queueId}/complete`, {
// //       method: 'POST',
// //       body: JSON.stringify(consultationData),
// //     });
// //   }

// //   // POST /doctor/queue/{queue_id}/no-show - No Show
// //   async markNoShow(queueId) {
// //     return this.request(`/doctor/queue/${queueId}/no-show`, {
// //       method: 'POST',
// //     });
// //   }

// //   // GET /doctor/patient/{patient_id} - View Patient
// //   async getPatient(patientId) {
// //     return this.request(`/doctor/patient/${patientId}`, {
// //       method: 'GET',
// //     });
// //   }

// //   // POST /doctor/notes - Add Note
// //   async addNote(noteData) {
// //     return this.request('/doctor/notes', {
// //       method: 'POST',
// //       body: JSON.stringify(noteData),
// //     });
// //   }

// //   // GET /doctor/stats - Get Stats
// //   async getStats() {
// //     return this.request('/doctor/stats', {
// //       method: 'GET',
// //     });
// //   }

// //   // GET /doctor/my-uploads - Get My Uploads
// //   async getMyUploads() {
// //     return this.request('/doctor/my-uploads', {
// //       method: 'GET',
// //     });
// //   }

// //   // ==================== Medical Files APIs ====================
  
// //   // POST /medical-files/upload - Upload Medical File
// //   async uploadMedicalFile(fileData) {
// //     const formData = new FormData();
// //     formData.append('file', fileData.file);
// //     formData.append('patient_id', fileData.patientId);
// //     formData.append('file_type', fileData.fileType);
    
// //     if (fileData.title) {
// //       formData.append('title', fileData.title);
// //     }
// //     if (fileData.description) {
// //       formData.append('description', fileData.description);
// //     }
// //     if (fileData.doctorId) {
// //       formData.append('doctor_id', fileData.doctorId);
// //     }

// //     return fetch(`${this.baseURL}/medical-files/upload`, {
// //       method: 'POST',
// //       body: formData,
// //     }).then(res => {
// //       if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
// //       return res.json();
// //     });
// //   }

// //   // GET /medical-files/patient/{patient_id} - Get Patient Medical Files
// //   async getPatientFiles(patientId, fileType = null) {
// //     const params = fileType ? `?file_type=${fileType}` : '';
// //     return this.request(`/medical-files/patient/${patientId}${params}`, {
// //       method: 'GET',
// //     });
// //   }

// //   // GET /medical-files/{file_id} - Get Single Medical File Metadata
// //   async getMedicalFile(fileId) {
// //     return this.request(`/medical-files/${fileId}`, {
// //       method: 'GET',
// //     });
// //   }

// //   // DELETE /medical-files/{file_id} - Delete Medical File
// //   async deleteMedicalFile(fileId) {
// //     return this.request(`/medical-files/${fileId}`, {
// //       method: 'DELETE',
// //     });
// //   }

// //   // Helper: Download Medical File (returns blob)
// //   async downloadMedicalFile(fileId) {
// //     const url = `${this.baseURL}/medical-files/${fileId}/download`;
    
// //     try {
// //       const response = await fetch(url);
// //       if (!response.ok) {
// //         throw new Error(`Download failed: ${response.status}`);
// //       }
// //       return await response.blob();
// //     } catch (error) {
// //       console.error('Download Error:', error);
// //       throw error;
// //     }
// //   }

// //   // Upload X-ray or Lab Test (legacy - kept for backward compatibility)
// //   async uploadFile(file, type) {
// //     const formData = new FormData();
// //     formData.append('file', file);
// //     formData.append('type', type);

// //     return fetch(`${this.baseURL}/doctor/upload`, {
// //       method: 'POST',
// //       body: formData,
// //     }).then(res => res.json());
// //   }
// // }

// // export default new DoctorAPI();



// // Doctor API Service
// const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

// class DoctorAPI {
//   constructor() {
//     this.baseURL = BASE_URL;
//   }

//   // Helper method for making requests
//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;
//     const config = {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//     };

//     try {
//       const response = await fetch(url, config);
      
//       if (!response.ok) {
//         const error = await response.json().catch(() => ({}));
//         throw new Error(error.message || `HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('API Request Error:', error);
//       throw error;
//     }
//   }

//   // GET /doctor/profile - Get Profile
//   async getProfile() {
//     return this.request('/doctor/profile', {
//       method: 'GET',
//     });
//   }

//   // PUT /doctor/profile - Update Profile
//   async updateProfile(profileData) {
//     return this.request('/doctor/profile', {
//       method: 'PUT',
//       body: JSON.stringify(profileData),
//     });
//   }

//   // PUT /doctor/status - Update Status
//   async updateStatus(statusData) {
//     return this.request('/doctor/status', {
//       method: 'PUT',
//       body: JSON.stringify(statusData),
//     });
//   }

//   // GET /doctor/queue - Get Queue
//   async getQueue() {
//     return this.request('/doctor/queue', {
//       method: 'GET',
//     });
//   }

//   // POST /doctor/queue/next - Call Next
//   async callNext() {
//     return this.request('/doctor/queue/next', {
//       method: 'POST',
//     });
//   }

//   // POST /doctor/queue/{queue_id}/complete - Complete
//   async completeConsultation(queueId, consultationData) {
//     return this.request(`/doctor/queue/${queueId}/complete`, {
//       method: 'POST',
//       body: JSON.stringify(consultationData),
//     });
//   }

//   // POST /doctor/queue/{queue_id}/no-show - No Show
//   async markNoShow(queueId) {
//     return this.request(`/doctor/queue/${queueId}/no-show`, {
//       method: 'POST',
//     });
//   }

//   // GET /doctor/patient/{patient_id} - View Patient
//   async getPatient(patientId) {
//     return this.request(`/doctor/patient/${patientId}`, {
//       method: 'GET',
//     });
//   }

//   // POST /doctor/notes - Add Note
//   async addNote(noteData) {
//     return this.request('/doctor/notes', {
//       method: 'POST',
//       body: JSON.stringify(noteData),
//     });
//   }

//   // GET /doctor/stats - Get Stats
//   async getStats() {
//     return this.request('/doctor/stats', {
//       method: 'GET',
//     });
//   }

//   // GET /doctor/my-uploads - Get My Uploads
//   async getMyUploads() {
//     return this.request('/doctor/my-uploads', {
//       method: 'GET',
//     });
//   }

//   // ==================== Medical Files APIs ====================
  
//   // POST /medical-files/analyze - Analyze Medical Image with AI
//   async analyzeMedicalImage(fileData) {
//     const formData = new FormData();
//     formData.append('file', fileData.file);
    
//     if (fileData.symptoms) {
//       formData.append('symptoms', fileData.symptoms);
//     }
//     if (fileData.patientId) {
//       formData.append('patient_id', fileData.patientId);
//     }

//     return fetch(`${this.baseURL}/medical-files/analyze`, {
//       method: 'POST',
//       body: formData,
//     }).then(res => {
//       if (!res.ok) throw new Error(`Analysis failed: ${res.status}`);
//       return res.json();
//     });
//   }
  
//   // POST /medical-files/upload - Upload Medical File
//   async uploadMedicalFile(fileData) {
//     const formData = new FormData();
//     formData.append('file', fileData.file);
//     formData.append('patient_id', fileData.patientId);
//     formData.append('file_type', fileData.fileType);
    
//     if (fileData.title) {
//       formData.append('title', fileData.title);
//     }
//     if (fileData.description) {
//       formData.append('description', fileData.description);
//     }
//     if (fileData.doctorId) {
//       formData.append('doctor_id', fileData.doctorId);
//     }

//     return fetch(`${this.baseURL}/medical-files/upload`, {
//       method: 'POST',
//       body: formData,
//     }).then(res => {
//       if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
//       return res.json();
//     });
//   }

//   // GET /medical-files/patient/{patient_id} - Get Patient Medical Files
//   async getPatientFiles(patientId, fileType = null) {
//     const params = fileType ? `?file_type=${fileType}` : '';
//     return this.request(`/medical-files/patient/${patientId}${params}`, {
//       method: 'GET',
//     });
//   }

//   // GET /medical-files/{file_id} - Get Single Medical File Metadata
//   async getMedicalFile(fileId) {
//     return this.request(`/medical-files/${fileId}`, {
//       method: 'GET',
//     });
//   }

//   // DELETE /medical-files/{file_id} - Delete Medical File
//   async deleteMedicalFile(fileId) {
//     return this.request(`/medical-files/${fileId}`, {
//       method: 'DELETE',
//     });
//   }

//   // Helper: Download Medical File (returns blob)
//   async downloadMedicalFile(fileId) {
//     const url = `${this.baseURL}/medical-files/${fileId}/download`;
    
//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error(`Download failed: ${response.status}`);
//       }
//       return await response.blob();
//     } catch (error) {
//       console.error('Download Error:', error);
//       throw error;
//     }
//   }

//   // Upload X-ray or Lab Test (legacy - kept for backward compatibility)
//   async uploadFile(file, type) {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('type', type);

//     return fetch(`${this.baseURL}/doctor/upload`, {
//       method: 'POST',
//       body: formData,
//     }).then(res => res.json());
//   }

//   // ==================== Appointments APIs ====================
  
//   // PUT /appointments/{appointment_id}/cancel - Cancel Appointment
//   async cancelAppointment(appointmentId) {
//     return this.request(`/appointments/${appointmentId}/cancel`, {
//       method: 'PUT',
//     });
//   }

//   // GET /patients/{patient_id}/appointments - Patient Appointments
//   async getPatientAppointments(patientId) {
//     return this.request(`/patients/${patientId}/appointments`, {
//       method: 'GET',
//     });
//   }

//   // ==================== Queue APIs (Patient Side) ====================
  
//   // POST /queue/join - Join Queue
//   async joinQueue(queueData) {
//     return this.request('/queue/join', {
//       method: 'POST',
//       body: JSON.stringify(queueData),
//     });
//   }

//   // GET /queue/status/{queue_id} - Queue Status
//   async getQueueStatus(queueId) {
//     return this.request(`/queue/status/${queueId}`, {
//       method: 'GET',
//     });
//   }

//   // GET /queue/patient/{patient_id}/active - Patient Active Queue
//   async getPatientActiveQueue(patientId) {
//     return this.request(`/queue/patient/${patientId}/active`, {
//       method: 'GET',
//     });
//   }

//   // PUT /queue/{queue_id}/cancel - Cancel Queue
//   async cancelQueue(queueId) {
//     return this.request(`/queue/${queueId}/cancel`, {
//       method: 'PUT',
//     });
//   }

//   // GET /queue/notifications/{patient_id} - Patient Notifications
//   async getPatientNotifications(patientId) {
//     return this.request(`/queue/notifications/${patientId}`, {
//       method: 'GET',
//     });
//   }
// }

// export default new DoctorAPI();



// // Doctor API Service
// const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

// class DoctorAPI {
//   constructor() {
//     this.baseURL = BASE_URL;
//   }

//   // Helper method for making requests
//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;
//     const config = {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//     };

//     try {
//       const response = await fetch(url, config);
      
//       if (!response.ok) {
//         const error = await response.json().catch(() => ({}));
//         throw new Error(error.message || `HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('API Request Error:', error);
//       throw error;
//     }
//   }

//   // GET /doctor/profile - Get Profile
//   async getProfile() {
//     return this.request('/doctor/profile', {
//       method: 'GET',
//     });
//   }

//   // PUT /doctor/profile - Update Profile
//   async updateProfile(profileData) {
//     return this.request('/doctor/profile', {
//       method: 'PUT',
//       body: JSON.stringify(profileData),
//     });
//   }

//   // PUT /doctor/status - Update Status
//   async updateStatus(statusData) {
//     return this.request('/doctor/status', {
//       method: 'PUT',
//       body: JSON.stringify(statusData),
//     });
//   }

//   // GET /doctor/queue - Get Queue
//   async getQueue() {
//     return this.request('/doctor/queue', {
//       method: 'GET',
//     });
//   }

//   // POST /doctor/queue/next - Call Next
//   async callNext() {
//     return this.request('/doctor/queue/next', {
//       method: 'POST',
//     });
//   }

//   // POST /doctor/queue/{queue_id}/complete - Complete
//   async completeConsultation(queueId, consultationData) {
//     return this.request(`/doctor/queue/${queueId}/complete`, {
//       method: 'POST',
//       body: JSON.stringify(consultationData),
//     });
//   }

//   // POST /doctor/queue/{queue_id}/no-show - No Show
//   async markNoShow(queueId) {
//     return this.request(`/doctor/queue/${queueId}/no-show`, {
//       method: 'POST',
//     });
//   }

//   // GET /doctor/patient/{patient_id} - View Patient
//   async getPatient(patientId) {
//     return this.request(`/doctor/patient/${patientId}`, {
//       method: 'GET',
//     });
//   }

//   // POST /doctor/notes - Add Note
//   async addNote(noteData) {
//     return this.request('/doctor/notes', {
//       method: 'POST',
//       body: JSON.stringify(noteData),
//     });
//   }

//   // GET /doctor/stats - Get Stats
//   async getStats() {
//     return this.request('/doctor/stats', {
//       method: 'GET',
//     });
//   }

//   // GET /doctor/my-uploads - Get My Uploads
//   async getMyUploads() {
//     return this.request('/doctor/my-uploads', {
//       method: 'GET',
//     });
//   }

//   // ==================== Medical Files APIs ====================
  
//   // POST /medical-files/analyze - Analyze Medical Image with AI
//   async analyzeMedicalImage(fileData) {
//     const formData = new FormData();
//     formData.append('file', fileData.file);
    
//     if (fileData.symptoms) {
//       formData.append('symptoms', fileData.symptoms);
//     }
//     if (fileData.patientId) {
//       formData.append('patient_id', fileData.patientId);
//     }

//     return fetch(`${this.baseURL}/medical-files/analyze`, {
//       method: 'POST',
//       body: formData,
//     }).then(res => {
//       if (!res.ok) throw new Error(`Analysis failed: ${res.status}`);
//       return res.json();
//     });
//   }
  
//   // POST /medical-files/upload - Upload Medical File
//   async uploadMedicalFile(fileData) {
//     const formData = new FormData();
//     formData.append('file', fileData.file);
//     formData.append('patient_id', fileData.patientId);
//     formData.append('file_type', fileData.fileType);
    
//     if (fileData.title) {
//       formData.append('title', fileData.title);
//     }
//     if (fileData.description) {
//       formData.append('description', fileData.description);
//     }
//     if (fileData.doctorId) {
//       formData.append('doctor_id', fileData.doctorId);
//     }

//     return fetch(`${this.baseURL}/medical-files/upload`, {
//       method: 'POST',
//       body: formData,
//     }).then(res => {
//       if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
//       return res.json();
//     });
//   }

//   // GET /medical-files/patient/{patient_id} - Get Patient Medical Files
//   async getPatientFiles(patientId, fileType = null) {
//     const params = fileType ? `?file_type=${fileType}` : '';
//     return this.request(`/medical-files/patient/${patientId}${params}`, {
//       method: 'GET',
//     });
//   }

//   // GET /medical-files/{file_id} - Get Single Medical File Metadata
//   async getMedicalFile(fileId) {
//     return this.request(`/medical-files/${fileId}`, {
//       method: 'GET',
//     });
//   }

//   // DELETE /medical-files/{file_id} - Delete Medical File
//   async deleteMedicalFile(fileId) {
//     return this.request(`/medical-files/${fileId}`, {
//       method: 'DELETE',
//     });
//   }

//   // Helper: Download Medical File (returns blob)
//   async downloadMedicalFile(fileId) {
//     const url = `${this.baseURL}/medical-files/${fileId}/download`;
    
//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error(`Download failed: ${response.status}`);
//       }
//       return await response.blob();
//     } catch (error) {
//       console.error('Download Error:', error);
//       throw error;
//     }
//   }

//   // Upload X-ray or Lab Test (legacy - kept for backward compatibility)
//   async uploadFile(file, type) {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('type', type);

//     return fetch(`${this.baseURL}/doctor/upload`, {
//       method: 'POST',
//       body: formData,
//     }).then(res => res.json());
//   }

//   // ==================== Appointments APIs ====================
  
//   // PUT /appointments/{appointment_id}/cancel - Cancel Appointment
//   async cancelAppointment(appointmentId) {
//     return this.request(`/appointments/${appointmentId}/cancel`, {
//       method: 'PUT',
//     });
//   }

//   // GET /patients/{patient_id}/appointments - Patient Appointments
//   async getPatientAppointments(patientId) {
//     return this.request(`/patients/${patientId}/appointments`, {
//       method: 'GET',
//     });
//   }

//   // ==================== Queue APIs (Patient Side) ====================
  
//   // POST /queue/join - Join Queue
//   async joinQueue(queueData) {
//     return this.request('/queue/join', {
//       method: 'POST',
//       body: JSON.stringify(queueData),
//     });
//   }

//   // GET /queue/status/{queue_id} - Queue Status
//   async getQueueStatus(queueId) {
//     return this.request(`/queue/status/${queueId}`, {
//       method: 'GET',
//     });
//   }

//   // GET /queue/patient/{patient_id}/active - Patient Active Queue
//   async getPatientActiveQueue(patientId) {
//     return this.request(`/queue/patient/${patientId}/active`, {
//       method: 'GET',
//     });
//   }

//   // PUT /queue/{queue_id}/cancel - Cancel Queue
//   async cancelQueue(queueId) {
//     return this.request(`/queue/${queueId}/cancel`, {
//       method: 'PUT',
//     });
//   }

//   // GET /queue/notifications/{patient_id} - Patient Notifications
//   async getPatientNotifications(patientId) {
//     return this.request(`/queue/notifications/${patientId}`, {
//       method: 'GET',
//     });
//   }
// }

// export default new DoctorAPI();

















// Doctor API Service - محدث باستخدام الـ APIs الموجودة فقط
const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

class DoctorAPI {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // فحص نوع المحتوى
      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          if (contentType && contentType.includes('application/json')) {
            const error = await response.json();
            errorMessage = error.message || error.detail || errorMessage;
          } else {
            const errorText = await response.text();
            console.error('❌ Server error:', errorText.substring(0, 200));
            errorMessage = `Server error (${response.status})`;
          }
        } catch (parseError) {
          console.error('❌ Error parsing error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }
      
      // معالجة الـ response الناجح
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        const text = await response.text();
        console.warn('⚠️ Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }
      
    } catch (error) {
      console.error('💥 API Request Error:', error);
      throw error;
    }
  }

  // ==================== Doctor Status APIs ====================
  
  /**
   * فحص حالة الدكتور - باستخدام الـ APIs الموجودة فعلاً
   * نستخدم doctor's queue لمعرفة إذا كان متاح أو مشغول
   * 
   * @param {string} doctorId - معرف الدكتور
   * @returns {Promise<{available: boolean, current_patients: number, status: string}>}
   */
  async checkDoctorAvailability(doctorId) {
    try {
      console.log('🔍 Checking doctor availability for ID:', doctorId);
      
      // نحاول نجيب الـ queue الخاص بالدكتور
      // ملحوظة: هنحتاج نتأكد من إن الـ API بيسمح بالوصول لـ queue دكتور معين
      // لو مش متاح، هنستخدم approach تاني
      
      try {
        // المحاولة الأولى: نجيب queue الدكتور
        const queueData = await this.getQueue();
        
        if (queueData && Array.isArray(queueData)) {
          const current_patients = queueData.length || 0;
          
          return {
            available: current_patients === 0,
            current_patients: current_patients,
            status: current_patients === 0 ? 'available' : 'busy',
            doctor_id: doctorId
          };
        }
        
      } catch (queueError) {
        console.warn('⚠️ Could not get queue, trying profile...');
        
        // المحاولة الثانية: نجيب profile الدكتور
        try {
          const profile = await this.getProfile();
          
          if (profile && profile.status) {
            return {
              available: profile.status === 'available',
              current_patients: profile.current_patients || 0,
              status: profile.status,
              doctor_id: doctorId
            };
          }
          
        } catch (profileError) {
          console.warn('⚠️ Could not get profile either');
        }
      }
      
      // لو كل المحاولات فشلت، نفترض إن الدكتور مشغول (للأمان)
      console.warn('⚠️ Unable to determine doctor availability - assuming busy for safety');
      return {
        available: false,
        current_patients: 1,
        status: 'unknown',
        doctor_id: doctorId,
        note: 'Could not verify availability - defaulting to busy'
      };
      
    } catch (error) {
      console.error('❌ Error checking doctor availability:', error);
      
      // في حالة الخطأ الكامل، نفترض مشغول
      return {
        available: false,
        current_patients: 1,
        status: 'unknown',
        error: error.message
      };
    }
  }

  /**
   * طريقة بديلة: فحص الحالة عن طريق محاولة الحجز
   * هذه الطريقة أكثر دقة لكن تحتاج patient_id حقيقي
   */
  async checkDoctorAvailabilityViaBooking(doctorId, patientId) {
    try {
      // نحاول نشوف لو المريض عنده queue نشطة مع الدكتور ده
      const activeQueue = await this.getPatientActiveQueue(patientId);
      
      if (activeQueue && activeQueue.doctor_id === doctorId) {
        // المريض عنده queue مع الدكتور ده
        return {
          available: false,
          current_patients: activeQueue.position || 1,
          status: 'busy',
          doctor_id: doctorId,
          note: 'Patient already in queue'
        };
      }
      
      // لو مفيش queue نشطة، نفترض متاح
      return {
        available: true,
        current_patients: 0,
        status: 'available',
        doctor_id: doctorId
      };
      
    } catch (error) {
      // لو حصل 404، يعني مفيش queue نشطة = الدكتور متاح
      if (error.message.includes('404')) {
        return {
          available: true,
          current_patients: 0,
          status: 'available',
          doctor_id: doctorId
        };
      }
      
      throw error;
    }
  }

  // GET /doctor/profile - Get Profile
  async getProfile() {
    return this.request('/doctor/profile', {
      method: 'GET',
    });
  }

  // PUT /doctor/profile - Update Profile
  async updateProfile(profileData) {
    return this.request('/doctor/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // PUT /doctor/status - Update Status
  async updateStatus(statusData) {
    return this.request('/doctor/status', {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  // GET /doctor/queue - Get Queue
  async getQueue() {
    return this.request('/doctor/queue', {
      method: 'GET',
    });
  }

  // POST /doctor/queue/next - Call Next
  async callNext() {
    return this.request('/doctor/queue/next', {
      method: 'POST',
    });
  }

  // POST /doctor/queue/{queue_id}/complete - Complete
  async completeConsultation(queueId, consultationData) {
    return this.request(`/doctor/queue/${queueId}/complete`, {
      method: 'POST',
      body: JSON.stringify(consultationData),
    });
  }

  // POST /doctor/queue/{queue_id}/no-show - No Show
  async markNoShow(queueId) {
    return this.request(`/doctor/queue/${queueId}/no-show`, {
      method: 'POST',
    });
  }

  // GET /doctor/patient/{patient_id} - View Patient
  async getPatient(patientId) {
    return this.request(`/doctor/patient/${patientId}`, {
      method: 'GET',
    });
  }

  // POST /doctor/notes - Add Note
  async addNote(noteData) {
    return this.request('/doctor/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  // GET /doctor/stats - Get Stats
  async getStats() {
    return this.request('/doctor/stats', {
      method: 'GET',
    });
  }

  // GET /doctor/my-uploads - Get My Uploads
  async getMyUploads() {
    return this.request('/doctor/my-uploads', {
      method: 'GET',
    });
  }

  // ==================== Medical Files APIs ====================
  
  // POST /medical-files/analyze - Analyze Medical Image with AI
  async analyzeMedicalImage(fileData) {
    const formData = new FormData();
    formData.append('file', fileData.file);
    
    if (fileData.symptoms) {
      formData.append('symptoms', fileData.symptoms);
    }
    if (fileData.patientId) {
      formData.append('patient_id', fileData.patientId);
    }

    return fetch(`${this.baseURL}/medical-files/analyze`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
      body: formData,
    }).then(async res => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Analysis failed: ${text}`);
      }
      return res.json();
    });
  }
  
  // POST /medical-files/upload - Upload Medical File
  async uploadMedicalFile(fileData) {
    const formData = new FormData();
    formData.append('file', fileData.file);
    formData.append('patient_id', fileData.patientId);
    formData.append('file_type', fileData.fileType);
    
    if (fileData.title) {
      formData.append('title', fileData.title);
    }
    if (fileData.description) {
      formData.append('description', fileData.description);
    }
    if (fileData.doctorId) {
      formData.append('doctor_id', fileData.doctorId);
    }

    return fetch(`${this.baseURL}/medical-files/upload`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
      body: formData,
    }).then(async res => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed: ${text}`);
      }
      return res.json();
    });
  }

  // GET /medical-files/patient/{patient_id} - Get Patient Medical Files
  async getPatientFiles(patientId, fileType = null) {
    const params = fileType ? `?file_type=${fileType}` : '';
    return this.request(`/medical-files/patient/${patientId}${params}`, {
      method: 'GET',
    });
  }

  // GET /medical-files/{file_id} - Get Single Medical File Metadata
  async getMedicalFile(fileId) {
    return this.request(`/medical-files/${fileId}`, {
      method: 'GET',
    });
  }

  // DELETE /medical-files/{file_id} - Delete Medical File
  async deleteMedicalFile(fileId) {
    return this.request(`/medical-files/${fileId}`, {
      method: 'DELETE',
    });
  }

  // Helper: Download Medical File (returns blob)
  async downloadMedicalFile(fileId) {
    const url = `${this.baseURL}/medical-files/${fileId}/download`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        }
      });
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      return await response.blob();
    } catch (error) {
      console.error('Download Error:', error);
      throw error;
    }
  }

  // Upload X-ray or Lab Test (legacy - kept for backward compatibility)
  async uploadFile(file, type) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return fetch(`${this.baseURL}/doctor/upload`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
      body: formData,
    }).then(res => res.json());
  }

  // ==================== Appointments APIs ====================
  
  // PUT /appointments/{appointment_id}/cancel - Cancel Appointment
  async cancelAppointment(appointmentId) {
    return this.request(`/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
    });
  }

  // GET /patients/{patient_id}/appointments - Patient Appointments
  async getPatientAppointments(patientId) {
    return this.request(`/patients/${patientId}/appointments`, {
      method: 'GET',
    });
  }

  // ==================== Queue APIs (Patient Side) ====================
  
  // POST /queue/join - Join Queue
  async joinQueue(queueData) {
    return this.request('/queue/join', {
      method: 'POST',
      body: JSON.stringify(queueData),
    });
  }

  // GET /queue/status/{queue_id} - Queue Status
  async getQueueStatus(queueId) {
    return this.request(`/queue/status/${queueId}`, {
      method: 'GET',
    });
  }

  // GET /queue/patient/{patient_id}/active - Patient Active Queue
  async getPatientActiveQueue(patientId) {
    return this.request(`/queue/patient/${patientId}/active`, {
      method: 'GET',
    });
  }

  // PUT /queue/{queue_id}/cancel - Cancel Queue
  async cancelQueue(queueId) {
    return this.request(`/queue/${queueId}/cancel`, {
      method: 'PUT',
    });
  }

  // GET /queue/notifications/{patient_id} - Patient Notifications
  async getPatientNotifications(patientId) {
    return this.request(`/queue/notifications/${patientId}`, {
      method: 'GET',
    });
  }
}

export default new DoctorAPI();