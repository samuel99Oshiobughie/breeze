import mongoose, { Schema, model, Model, Document } from 'mongoose';

export interface INote extends Document {
    title: string;
    userId: string;
    content: string;
    deleted?: boolean;
}

const noteSchema: Schema = new Schema<INote>({
    title: {
        type: String,
        required: true
    },
    userId: { 
        type: String, 
        default: null 
    },
    content: {
        type: String,
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

const Note: Model<INote> = mongoose.models.Note || model<INote>('Note', noteSchema);

export default Note;