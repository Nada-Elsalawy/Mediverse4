// Doctor API Service
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
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
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
      body: formData,
    }).then(res => {
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
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
      const response = await fetch(url);
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
      body: formData,
    }).then(res => res.json());
  }
}

export default new DoctorAPI();