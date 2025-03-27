import { createStore, action, Action, createTypedHooks } from 'easy-peasy';
import { IProject, ITask, INote, IMessage, ISnackbarMessageSeverity } from '@/interface/interface';

interface IData {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: 'high' | 'medium' | 'low';
}


interface BreezeStoreModel{
    projects: IProject[] | null
    setProjects: Action<BreezeStoreModel, IProject[] | null>
    addProject: Action<BreezeStoreModel, IProject >
    tasks: ITask[] | null
    setTasks: Action<BreezeStoreModel, ITask[] | null>
    addTask: Action<BreezeStoreModel, ITask >
    notes: INote[] | null
    setNotes: Action<BreezeStoreModel, INote[] | null>
    addNote: Action<BreezeStoreModel, INote>

    loading: boolean
    setLoading: Action<BreezeStoreModel, boolean>
    messages: IMessage [] | null
    setMessages: Action<BreezeStoreModel, IMessage>
    existingData: IData | null
    setExistingData: Action<BreezeStoreModel, IData>

    snackbarMessage: string
    setSnackbarMessage: Action<BreezeStoreModel, string>
    snackbarMessageSeverity: ISnackbarMessageSeverity
    setSnackbarMessageSeverity: Action<BreezeStoreModel, ISnackbarMessageSeverity>
};

export const BreezeStore = createStore<BreezeStoreModel>({
    projects: [
        // {
        //     _id: '101',
        //         userId: '12',
        //     name: 'Customer Portal Redesign',
        //     description: 'Revamp of existing customer interface',
        //     status: 'Active',
        //     createdAt: '2025-02-01',
        //     updatedAt: '2025-02-01',
        //   },
        //   {
        //     _id: '102',
        //         userId: '12',
        //     name: 'Internal Workflow Automation',
        //     description: 'Streamlining internal processes',
        //     status: 'On Hold',
        //     createdAt: '2025-02-01',
        //     updatedAt: '2025-02-01',
        //   }
    ],
    setProjects: action((state, payload) => {
        state.projects = payload
    }),
    addProject: action((state, payload) => {
        payload && state.projects?.push(payload) 
    }),
    tasks: [
        // { _id: '1', userId: '12',projectId: 'default-projectId1', title: 'Complete project proposal', description: 'Draft and finalize the project proposal document.', dueDate: '2025-02-01', completed: false, priority: 'high', tracked: false, createdAt: '2025-02-01', updatedAt: '2025-02-01'},
        // { _id: '2', userId: '12',projectId: 'default-projectId1', title: 'Review team updates', description: 'Go through the latest updates from the team members.', dueDate: '2025-01-30', completed: true, priority: 'medium', tracked: false, createdAt: '2025-02-01', updatedAt: '2025-02-01'},

    ],
    setTasks: action((state, payload) => {
        state.tasks = payload
    }),
    addTask: action((state, payload) => {
       payload && state.tasks?.push(payload)
    }),
    notes: [
        // { 
        //     _id: '1',
        //     title: 'Meeting Notes',
        //     content: '<p>Discussion points...</p>',
        //     createdAt: '2025-02-01',
        //     updatedAt: '2025-02-01' 
        // },
        // { _id: '2', title: 'Project Ideas', content: '<p>New features...</p>', createdAt: '2025-02-01', updatedAt: '2025-02-01' },
    ],
    setNotes: action((state, payload) => {
    state.notes = payload
    }),
    addNote: action((state, payload) => {
        payload && state.notes?.push(payload)
    }),
    loading: false,
    setLoading: action((state, payload) => {
        state.loading = payload
    }),
    messages: [
        { 
            id: 1, 
            text: "Hi there! would you love to create a new task today?", 
            isUser: false, 
            timestamp: new Date() 
        }
    ],
    setMessages: action((state, payload) => {
        payload && state.messages?.push(payload)
    }),
    existingData: {},
    setExistingData: action((state, payload) => {
        state.existingData = payload
    }),
    snackbarMessage: '',
    setSnackbarMessage: action((state, payload) => {
        state.snackbarMessage = payload || ''
    }),
    snackbarMessageSeverity: 'info',
    setSnackbarMessageSeverity: action((state, payload) => {
        state.snackbarMessageSeverity = payload
    }),
});

const typedHooks = createTypedHooks<BreezeStoreModel>();

export const useBreezeStoreState = typedHooks.useStoreState;
export const useBreezeStoreActions = typedHooks.useStoreActions;
export const useBreezeStoreDispatch = typedHooks.useStoreDispatch;