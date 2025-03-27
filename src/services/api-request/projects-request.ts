import { apiUrl } from "../config";
import axios from 'axios';

const baseUrl = apiUrl;
const projectBaseUrl = `${baseUrl}/api/project`

// console.log("baseUrl", apiUrl)

interface NewProject {
    name: string;
    description: string;
    status: 'Active' | 'Completed' | 'On Hold';
}

export const createProject = async (newProject: NewProject) => {
    const response = await axios.post(projectBaseUrl, newProject);
    return response
}

export const fetchProjects = async () => {
    const response = await axios.get(projectBaseUrl);
    return response;
}

export const fetchProjectById = async (projectId: string) => {
    const url = `${projectBaseUrl}?projectId=${projectId}`
    const response = await axios.get(url);
    return response;
}

export const deleteProject = async (projectId: string) => {
    const url = `${projectBaseUrl}?projectId=${projectId}`
    const response = await axios.delete(url);
    return response
}