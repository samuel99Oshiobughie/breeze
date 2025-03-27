import { apiUrl } from "../config";
import axios from 'axios';

const baseUrl = apiUrl;
const taskBaseUrl = `${baseUrl}/api/task`


interface NewTask {
    title: string;
    projectId?: string;
    description: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
}

export const createTask = async (newTask: NewTask) => {
    const response = await axios.post(taskBaseUrl, newTask);
    return response;
}

export const fetchTasks = async () => {
    const response = await axios.get(taskBaseUrl);
    return response;
}

export const fetchTaskById = async (taskId: string, projectId?: string) => {
    const url = projectId
    ? `${taskBaseUrl}?taskId=${taskId}&project=${projectId}`
    : `${taskBaseUrl}?taskId=${taskId}`;
    const response = await axios.get(url);
    return response;
}

export const fetchProjectTaskById = async (projectId: string) => {
    const response = await axios.get(`${taskBaseUrl}?projectId=${projectId}`);
    return response;
}

export const updateTask = async ({taskId, updatedTask = {}, projectId} : {taskId?: string, updatedTask?: any, projectId?: string}) => {
    // console.log(`task-id: ${taskId}, ${projectId}, ${updatedTask}`);
    const url = `${taskBaseUrl}?taskId=${taskId}&projectId=${projectId}`
    const response = await axios.put(url, updatedTask);
    return response;
};

export const deleteTask = async (taskId: string, projectId?: string) => {
    const url = projectId
    ? `${taskBaseUrl}?taskId=${taskId}&project=${projectId}`
    : `${taskBaseUrl}?taskId=${taskId}`;
    const response = await axios.delete(url);
    return response
}



