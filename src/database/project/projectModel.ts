import mongoose, { Schema, model, Model, Document } from 'mongoose';

export interface IProject extends Document {
    name: string;
    userId: string;
    description: string;
    status: 'Active' | 'Completed' | 'On Hold';
    deleted?: boolean;
}

const projectSchema: Schema = new Schema<IProject>({
    name: {
        type: String,
        required: true
    },
    userId: { 
        type: String, 
        default: null 
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active','Completed', 'On Hold'],
        required: true
    },
    deleted: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
},
);

const Project: Model<IProject> = mongoose.models.Project || model<IProject>('Project', projectSchema);

export default Project;