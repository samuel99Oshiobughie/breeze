import { apiUrl } from "../config";
import axios from 'axios';

const baseUrl = apiUrl;
const aiBaseUrl = `${baseUrl}/api/ai`

// console.log("baseUrl", aiBaseUrl )

export const aiRequest = async (prompt: string) => {
    // console.log("prompt: ", prompt)
    const response = await axios.post(aiBaseUrl , {prompt: prompt});
    return response
}