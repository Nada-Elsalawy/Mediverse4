import axios from "axios"

const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';




export async function loginApi(formData) {
    try {
        const { data } = await axios.post(BASE_URL + "/auth/doctor/login", formData)
        return data;
    } catch (error) {
        return error.response ? error.response.data.error : error.message;
    }
}