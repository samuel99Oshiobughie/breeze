import { NextApiRequest } from 'next';

export interface IProject {
    _id: string;
    userId: string;
    name: string;
    description: string;
    status: 'Active' | 'Completed' | 'On Hold';
    createdAt: string;
    updatedAt: string
  }

export interface ITask {
  _id: string;
  userId: string;
  projectId: string; 
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low'; 
  createdAt: string;
  updatedAt: string;// Restrict priority to specific values
  tracked?: boolean;
}

export interface IUpdate {
  projectId?: string; // Optional
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  priority?: 'high' | 'medium' | 'low';
  tracked?: boolean;
}

export interface INote {
  _id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export type ISnackbarMessageSeverity = 'error' | 'warning' | 'info' | 'success'

export interface ExtendedNextApiRequest extends NextApiRequest {
  sessionId?: string; 
}