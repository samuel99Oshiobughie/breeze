import { NextApiRequest, NextApiResponse } from 'next';
import {
    createNoteController,
    getNotesController,
    updateNoteController,
    deleteNoteController
} from '@/database/note/note'
import { applyMiddleware } from '@/lib/middleware';


async function postNoteHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const note = await createNoteController(req.body, req);
        return res.status(201).json({ success: true, data: note });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getNotesHandler(req: NextApiRequest, res: NextApiResponse) {
    try {      
        const notes = await getNotesController(req);
        return res.status(200).json({ success: true, data: notes });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateNotesHandler(req: NextApiRequest, res: NextApiResponse) {
    try {  
        
        if (req.method !== 'PUT') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
        
        const { noteId } = req.query;
        const  noteObject  = req.body;

        const updatedNote = await updateNoteController(noteObject, noteId as string, req);
        return res.status(200).json({ success: true, data: updatedNote });
        
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteNoteHandler(req: NextApiRequest, res: NextApiResponse) {
    try {  
        if (req.method !== 'DELETE') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
        
        const { noteId } = req.query;
        const  noteObject  = req.body;

        const deletedNote = await deleteNoteController(noteObject, noteId as string, req);
        return res.status(200).json({ success: true, data: deletedNote });
        
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default applyMiddleware(async (req: NextApiRequest, res: NextApiResponse) => {
    try {;
        switch(req.method) {
            case 'GET':
                getNotesHandler(req, res);
                break
            case 'POST':
                await postNoteHandler(req, res);
                break;
            case 'PUT':
                await updateNotesHandler(req, res);
                break;
            case 'DELETE':
                await deleteNoteHandler(req, res);
                break;
            default:
                res.status(400).json({ success: false, error: 'Method not allowed' });
        }
        
    } catch (error) {
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Server error' });
    }
});