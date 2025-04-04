import { useRef } from 'react';
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

    const fetchAllProjects = useRef<(() => Promise<void>) | null>(null)
    const fetchAllTasks = useRef<(() => Promise<void>) | null>(null)
    const fetchAllNotes = useRef<(() => Promise<void>) | null>(null)

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

   if(!fetchAllProjects.current) {
       fetchAllProjects.current = async() => {
           try {
           setLoading(true)
           const res = await fetchProjects();
           const fetchedData = res.data.data
           setProjects(fetchedData)
           } catch (error: unknown) {
               if (typeof error === "object" && error !== null && "response" in error) {
                   const axiosError = error as { response: { data: { error: string } } };
                   const errorMessage = axiosError.response.data.error;
                   openError(errorMessage);
               } else {
                   openError("An unexpected error occurred.");
               }
           } finally {
               setLoading(false)
           }
       };
   }

    const submitNewProject = async (projectObject: {
        name: string;
        description: string;
        status: 'Active' | 'Completed' | 'On Hold';
    }) => {
        try {
            const response  = await createProject(projectObject)
            const newProject = response.data.data
            addProject(newProject)
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "response" in error) {
                const axiosError = error as { response: { data: { error: string } } };
                const errorMessage = axiosError.response.data.error;
                openError(errorMessage);
            } else {
                openError("An unexpected error occurred.");
            }
        }
    };

    const deleteProjects = async (projectId: string) => {
        try {
            
            const response = await deleteProject(projectId);
            const projectFilter = projects?.filter(p => p._id !== projectId);
            
            if(projectFilter) {
             setProjects(projectFilter);
            }
             
            return response;
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "response" in error) {
                const axiosError = error as { response: { data: { error: string } } };
                const errorMessage = axiosError.response.data.error;
                openError(errorMessage);
            } else {
                openError("An unexpected error occurred.");
            }
        }
      }

    if(!fetchAllTasks.current) {
        fetchAllTasks.current = async() => {
            try {
                setLoading(true)
                const res = await fetchTasks();
                const fetchedData = res.data.data
                setTasks(fetchedData)
            } catch (error: unknown) {
                if (typeof error === "object" && error !== null && "response" in error) {
                    const axiosError = error as { response: { data: { error: string } } };
                    const errorMessage = axiosError.response.data.error;
                    openError(errorMessage);
                } else {
                    openError("An unexpected error occurred.");
                }
            }finally {
                setLoading(false)
            }
        };
    }


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
    }catch (error: unknown) {
        if (typeof error === "object" && error !== null && "response" in error) {
            const axiosError = error as { response: { data: { error: string } } };
            const errorMessage = axiosError.response.data.error;
            openError(errorMessage);
        } else {
            openError("An unexpected error occurred.");
        }
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
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "response" in error) {
                const axiosError = error as { response: { data: { error: string } } };
                const errorMessage = axiosError.response.data.error;
                openError(errorMessage);
            } else {
                openError("An unexpected error occurred.");
            }
        }
    };


    const deleteTasks = async (taskId: string, projectId?: string) => {
        try {
    
          await deleteTask(taskId, projectId);
    
          const taskFilter = tasks?.filter(t => t._id !== taskId);

          if(taskFilter) {
           setTasks(taskFilter);
          }
    
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "response" in error) {
                const axiosError = error as { response: { data: { error: string } } };
                const errorMessage = axiosError.response.data.error;
                openError(errorMessage);
            } else {
                openError("An unexpected error occurred.");
            }
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
        }catch (error: unknown) {
            if (typeof error === "object" && error !== null && "response" in error) {
                const axiosError = error as { response: { data: { error: string } } };
                const errorMessage = axiosError.response.data.error;
                openError(errorMessage);
            } else {
                openError("An unexpected error occurred.");
            }
        }
    };

    if(!fetchAllNotes.current){
        fetchAllNotes.current = async() => {
            try {
                setLoading(true)
                const res = await fetchNotes();
                const fetchedData = res.data.data
                setNotes(fetchedData)
            } catch (error: unknown) {
                if (typeof error === "object" && error !== null && "response" in error) {
                    const axiosError = error as { response: { data: { error: string } } };
                    const errorMessage = axiosError.response.data.error;
                    openError(errorMessage);
                } else {
                    openError("An unexpected error occurred.");
                }
            } finally {
                setLoading(false)
            }
        };
    }

    const updateNote = async ({noteObject, noteId}:{
        noteObject: {
        title: string;
        content: string;
        },
        noteId: string
    }) => {
        try {
            const response  = await noteUpdate(noteObject, noteId)
            return response
        }catch (error: unknown) {
            if (typeof error === "object" && error !== null && "response" in error) {
                const axiosError = error as { response: { data: { error: string } } };
                const errorMessage = axiosError.response.data.error;
                openError(errorMessage);
            } else {
                openError("An unexpected error occurred.");
            }
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
            if(note) {
                setNotes(note);
            }
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "response" in error) {
                const axiosError = error as { response: { data: { error: string } } };
                const errorMessage = axiosError.response.data.error;
                openError(errorMessage);
            } else {
                openError("An unexpected error occurred.");
            }
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
                    id: (messages?.length ?? 0) + 2, 
                    text: message, 
                    isUser: false,
                    timestamp: new Date()
                  });
            } else {
                setExistingData({})
                addTask(taskData)
                setMessages({
                    id: (messages?.length ?? 0) + 2, 
                    text: 'Task successfully created', 
                    isUser: false,
                    timestamp: new Date()
                  });
            }
        } catch (error: unknown) {
            setExistingData({})
            if (typeof error === "object" && error !== null) {
                const axiosError = error as { status?: number; response?: { data?: { error?: string; message?: string } } };
        
                if (axiosError.status === 500 && axiosError.response?.data?.error) {
                    openError(axiosError.response.data.error);
                    return;
                }
        
                const errorMessage = axiosError.response?.data?.message || "Sorry, I encountered an error. Please try again.";
                setMessages({
                    id: (messages?.length ?? 0) + 2,
                    text: errorMessage,
                    isUser: false,
                    timestamp: new Date(),
                });
            } else {
                openError("An unexpected error occurred.");
            }
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