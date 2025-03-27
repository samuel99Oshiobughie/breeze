import { apiUrl } from "../config";
import axios from 'axios';

const baseUrl = apiUrl;
const noteBaseUrl = `${baseUrl}/api/note`

export const createNote = async (newNote:{ title: string, content: string}) => {
    const response = await axios.post(noteBaseUrl, newNote);
    return response
}

export const fetchNotes = async () => {
    const response = await axios.get(noteBaseUrl);
    return response;
}

export const noteUpdate = async (noteObject:{ title: string; content: string }, noteId: string) => {
    const url = `${noteBaseUrl}?noteId=${noteId}`
    const response = await axios.put(url, noteObject)
    return response;
}

export const noteDelete = async (noteObject:{ deleted: boolean }, noteId: string) => {
    const url = `${noteBaseUrl}?noteId=${noteId}`
    const response = await axios.put(url, noteObject)
    return response;
}