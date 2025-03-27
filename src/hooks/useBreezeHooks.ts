import {
    useBreezeStoreState,
    useBreezeStoreActions
} from '@/store/BreezeStore'
import { ISnackbarMessageSeverity } from '@/interface/interface';

import {createTask, fetchTasks, updateTask, deleteTask} from '@/services/api-request/tasks-request';
import {createProject, fetchProjects, deleteProject} from '@/services/api-request/projects-request';
import {createNote, fetchNotes, noteUpdate, noteDelete} from '@/services/api-request/notes-request';
import { aiRequest } from '@/services/api-request/ai-request';

export interface ITask {
    projectId?: string;
    title?: string;
    description?: string;
    dueDate?: string;
    completed?: boolean;
    priority?: 'high' | 'medium' | 'low'; 
    tracked?: boolean;
    createdAt?: string;
    updatedAt?: string;// Restrict priority to specific values
  }

export default function useBreezeHooks() {
    const projects = useBreezeStoreState(state => state.projects)
    const setProjects = useBreezeStoreActions(action => action.setProjects)
    const addProject = useBreezeStoreActions(action => action.addProject)
    const tasks = useBreezeStoreState(state => state.tasks)
    const setTasks = useBreezeStoreActions(action => action.setTasks)
    const addTask = useBreezeStoreActions(action => action.addTask)
    const notes = useBreezeStoreState(state => state.notes)
    const setNotes = useBreezeStoreActions(action => action.setNotes)
    const addNote = useBreezeStoreActions(action => action.addNote)

    const loading = useBreezeStoreState(state => state.loading)
    const setLoading = useBreezeStoreActions(action => action.setLoading)
    const messages = useBreezeStoreState(state => state.messages)
    const setMessages = useBreezeStoreActions(action => action.setMessages)
    const existingData = useBreezeStoreState(state => state.existingData)
    const setExistingData = useBreezeStoreActions(action => action.setExistingData)
    const snackbarMessage = useBreezeStoreState(action => action.snackbarMessage)
    const setSnackbarMessage = useBreezeStoreActions(action => action.setSnackbarMessage)
    const snackbarMessageSeverity =  useBreezeStoreState(state => state.snackbarMessageSeverity)
    const setSnackbarMessageSeverity = useBreezeStoreActions(action => action.setSnackbarMessageSeverity,)

    function openSnackbar(
        message: string,
        messageSeverity: ISnackbarMessageSeverity,
      ) {
        setSnackbarMessageSeverity(messageSeverity)
        setSnackbarMessage(message)
    }
    
    function openSuccess(message: string) {
    openSnackbar(message, 'success')
    }

    function openError(message: string) {
    openSnackbar(message, 'error')
    } 

    function openWarning(message: string) {
    openSnackbar(message, 'warning')
    }

    const fetchAllProjects = async() => {
        try {
        setLoading(true)
        const res = await fetchProjects();
        const fetchedData = res.data.data
        setProjects(fetchedData)
        } catch (error: any) {
            const errorMessage = error.response.data.error;
            openError(errorMessage);
        } finally {
            setLoading(false)
        }
    };

    const submitNewProject = async (projectObject: {
        name: string;
        description: string;
        status: 'Active' | 'Completed' | 'On Hold';
    }) => {
        try {
            const response  = await createProject(projectObject)
            const newProject = response.data.data
            addProject(newProject)
        } catch (error: any) {
            const errorMessage = error.response.data.error;
            openError(errorMessage);
        }
    };

    const deleteProjects = async (projectId: string) => {
        try {
            
            const response = await deleteProject(projectId);
            const projectFilter = projects?.filter(p => p._id !== projectId);
            
            projectFilter && setProjects(projectFilter);
        } catch (error: any) {
            const errorMessage = error.response.data.error;
            openError(errorMessage);
        }
      }

    const fetchAllTasks = async() => {
        try {
          setLoading(true)
          const res = await fetchTasks();
          const fetchedData = res.data.data
          setTasks(fetchedData)

        } catch (error: any) {
            const errorMessage = error.response.data.error;
            openError(errorMessage);
        } finally {
            setLoading(false)
        }
      };

    const submitNewTask = async (taskObject: {
        title: string;
        description: string;
        dueDate: string;
        priority: "high" | "medium" | "low";
    }) => {
    try {
        const response  = await createTask(taskObject)
        const newTask = response.data.data
        addTask(newTask)
    } catch (error: any) {
        const errorMessage = error.response.data.error;
        openError(errorMessage);
    }
    };


    const updateTasks = async ({taskId, projectId, updatedState}: {taskId?: string, projectId?: string, updatedState?: ITask}) => {
        try {
            if(taskId) {
                const response = await updateTask({taskId:taskId, updatedTask:updatedState, projectId:projectId});
                return response

            } else {
                const response = await updateTask({projectId:projectId});
                return response

            }
        } catch (error: any) {
            const errorMessage = error.response.data.error;
            openError(errorMessage);
        }
    };


    const deleteTasks = async (taskId: string, projectId?: string) => {
        try {
    
          await deleteTask(taskId, projectId);
    
          const taskFilter = tasks?.filter(t => t._id !== taskId);

          taskFilter && setTasks(taskFilter);
    
        } catch (error: any) {
            const errorMessage = error.response.data.error;
            openError(errorMessage);
        }
    }

    const submitNewNote = async (noteObject: {
        title: string;
        content: string;
    }) => {
        try {
            const response  = await createNote(noteObject)
            const newNote = response.data.data
            addNote(newNote)
        } catch (error: any) {
            const errorMessage = error.response.data.error;
            openError(errorMessage);
        }
    };

    const fetchAllNotes = async() => {
        try {
            setLoading(true)
            const res = await fetchNotes();
            const fetchedData = res.data.data
            setNotes(fetchedData)
        } catch (error: any) {
            const errorMessage = error.response.data.error;
            openError(errorMessage);
        } finally {
            setLoading(false)
        }
    };

    const updateNote = async ({noteObject, noteId}:{
        noteObject: {
        title: string;
        content: string;
        },
        noteId: string
    }) => {
        try {
            const response  = await noteUpdate(noteObject, noteId)
            const updatedNote = response.data.data
        } catch (error: any) {
            const errorMessage = error.response.data.error;
            openError(errorMessage);
        }
    };

    const deleteNote = async ({noteObject, noteId}:{
        noteObject: {
        deleted: boolean
        },
        noteId: string
    }) => {
        try {
            const response  = await noteDelete(noteObject, noteId)
            const deletedNote = response.data.data

            const note = notes?.filter(note => note._id !== deletedNote._id)
            note && setNotes(note);
        } catch (error: any) {
            const errorMessage = error.response.data.error;
            openError(errorMessage);
        }
    };


    const getAIResponse = async (reqMessage: string) => {
        try {
            const existingDataStr = existingData
            ? Object.entries(existingData)
                .map(([key, value]) => `${key} ${value}`)
                .join(', ')
            : '';
            // console.log("existingDataStr: ", existingDataStr)
            // console.log("existingData: ", existingData)

            const reqMessages = existingDataStr
                ? `${reqMessage}, ${existingDataStr}`
                : reqMessage;
            // console.log(reqMessages)

            const response =  await aiRequest(reqMessages)
            // console.log('ai-res:', response)
            const { message, taskData } = response.data
            // console.log('ai-message: ', message);
            // console.log('ai-taskData: ', taskData)
            if (message !== '') {
                setExistingData(taskData)
                setMessages({
                    id: messages?.length! + 2, 
                    text: message, 
                    isUser: false,
                    timestamp: new Date()
                  });
            } else {
                setExistingData({})
                addTask(taskData)
                setMessages({
                    id: messages?.length! + 2, 
                    text: 'Task successfully created', 
                    isUser: false,
                    timestamp: new Date()
                  });
            }
        } catch (error: any) {
            if(error.status === 500) {
                const errorMessage = error.response.data.error;
                openError(errorMessage);
                return;
            }
            
            const errorMessage = error.response.data.message
            setMessages(
                { 
                id: messages?.length! + 2, 
                text: errorMessage ? errorMessage : "Sorry, I encountered an error. Please try again.", 
                isUser: false,
                timestamp: new Date()
                });
        } finally {
            setLoading(false);
        }

    }
    

    return {
        tasks,
        setTasks,
        submitNewTask,
        fetchAllTasks,
        updateTasks,
        deleteTasks,
        projects,
        submitNewProject,
        fetchAllProjects,
        deleteProjects,
        notes,
        setNotes,
        addNote,
        submitNewNote,
        fetchAllNotes,
        updateNote,
        deleteNote,

        loading,
        setLoading,
        messages,
        setMessages,
        getAIResponse,

        open: openSnackbar,
        success: openSuccess,
        error: openError,
        warning: openWarning,
        snackbarMessage,
        setSnackbarMessage,
        snackbarMessageSeverity,
        setSnackbarMessageSeverity
    }
}