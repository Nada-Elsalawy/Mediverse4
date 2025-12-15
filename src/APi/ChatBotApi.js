

import axios from "axios";

const API_BASE_URL = "https://subrhombical-akilah-interproglottidal.ngrok-free.dev";
const MODEL_MAPPING = {
  "Gpt-4o🧠 ": "GPT-4o 💎",
  "Gpt-4oMini🚀 ": "GPT-4o Mini 💎",
  "Gemini Pro 1.5 💎 ": "Gemini Pro 1.5 💎",
  "Claude 3 Haiku💫 ": "Claude 3 Haiku 💎",
  "Claude 3.5 Sonnet 🤖 ": "Claude 3.5 Sonnet 💎",
  "Laama 3.1 70B🐂 ": "Llama 3.1 70B 💎",
  "Mixtral 8x7B💥 ": "Mixtral 8x7B 💎"
};



export const sendConsultation = async (consultationData) => {
  try {
    console.log('📤 Sending to API:', consultationData);

    const response = await fetch(`${API_BASE_URL}/chatbot/consultation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(consultationData),
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`خطأ في الخادم (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Response received:', data);
    return data;

  } catch (error) {
    console.error('💥 Error:', error);
    throw error;
  }
};


export const prepareConsultationData = (symptoms, patientData = {}) => {
  const cleanModel =
    MODEL_MAPPING[patientData.model] ||
    patientData.model ||
    "GPT-4o Mini 💎";

  const payload = {
    symptoms: String(symptoms),
    model: cleanModel,
    patient_age: patientData.patient_age ?? 18,
    patient_gender: patientData.patient_gender ?? "male",
    patient_weight: patientData.patient_weight ?? null,
    patient_height: patientData.patient_height ?? null,
    chronic_diseases: patientData.chronic_diseases ?? [],
    allergies: patientData.allergies ?? [],
    current_medications: patientData.current_medications ?? [],
    use_rag: patientData.use_rag ?? true,
    top_k: patientData.top_k ?? 5,
  };


  if (patientData.patient_id !== undefined) {
    payload.patient_id = patientData.patient_id;
  }

  return payload;
};
