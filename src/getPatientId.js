

export const getPatientId = () => {
  const id = localStorage.getItem("patient_id");
  return id ? Number(id) : undefined;
};