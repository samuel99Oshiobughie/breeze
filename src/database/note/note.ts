import { ExtendedNextApiRequest } from '@/interface/interface'
import Note, { INote } from './noteModel';

export const createNoteController = async (noteDetails: {
    title: string;
    content: string;
}, req: ExtendedNextApiRequest): Promise<INote>=> {
    try {
        const userId = req.sessionId
        // console.log('user-id: ', userId)
        const details = { ...noteDetails, userId}
        const note = await Note.create(details);
        return note;
    } catch (error) {
        console.error("Error creating note:", error);
        throw new Error(`Error creating note: ${error}`)
    }
};

export const getNotesController = async (req: ExtendedNextApiRequest) => {
    try {
        const userId = req.sessionId
        // console.log('user-id: ', userId)
        return await Note.find({
            userId,
            deleted: {$ne: true}
        })
    } catch (error) {
        throw new Error(`Error getting notes: ${error}`)
    }
}

export const updateNoteController = async (
    noteDetails: {
    title: string;
    content: string;
    },
    noteId: string,
    req: ExtendedNextApiRequest
) => {

    try {
        const userId = req.sessionId
        // console.log('user-id: ', userId)
        const updatedNote = await Note.findOneAndUpdate(
            {_id: noteId, userId},
            noteDetails,
            {new: true}
        );

        if (!updatedNote) {
            throw new Error('Note not found or not updated');
        }

        return updatedNote;
    } catch (error) {
        console.error("Error updating note:", error);
        throw new Error(`Error updating note: ${error}`)
    }
};
export const deleteNoteController = async (
    noteDetails: {
    deleted: boolean
    },
    noteId: string,
    req: ExtendedNextApiRequest
) => {

    try {
        const userId = req.sessionId
        // console.log('user-id: ', userId)
        const deletedNote = await Note.findOneAndUpdate(
            {_id: noteId, userId},
            noteDetails,
            {new: true}
        );

        if (!deletedNote) {
            throw new Error('Note not found or not deleted');
        }

        return deletedNote;
    } catch (error) {
        console.error("Error creating note:", error);
        throw new Error(`Error creating note: ${error}`)
    }
};