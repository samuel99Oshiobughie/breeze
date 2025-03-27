import mongoose, { Schema, model, Model, Document } from 'mongoose';

export interface ITask extends Document {
    title: string;
    userId: string;
    projectId?: string;
    description: string;
    dueDate: string;
    completed?: boolean;
    priority: 'high' | 'medium' | 'low';
    deleted?: boolean;
    tracked?: boolean;
}

const taskSchema: Schema = new Schema<ITask>({
    title: {
        type: String,
        required: true
    },
    userId: { 
        type: String, 
        default: null 
    },
    projectId: {
        type: String,
        ref: 'Project',
        default: 'default_project_id' 
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['high','medium', 'low'],
        required: true
    },
    deleted: {
        type: Boolean,
        default: false,
      },
    tracked: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
},
);

const Task: Model<ITask> = mongoose.models.Task || model<ITask>('Task', taskSchema);

export default Task;