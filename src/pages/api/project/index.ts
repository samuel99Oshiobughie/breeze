import { NextApiRequest, NextApiResponse } from 'next';
import {
    createProjectController,
    getProjectsController,
    getProjectByIdController ,
    deleteProjectController
} from '@/database/project/project'
import { applyMiddleware } from '@/lib/middleware';


async function postProjectHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const project = await createProjectController(req.body, req);
        return res.status(201).json({ success: true, data: project });
    } catch (error) {
        return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
    }
}

async function getProjectsHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        
        const {projectId} = req.query;

        if (projectId) {
            const project = await getProjectByIdController (String(projectId), req);
            return res.status(200).json({ success: true, data: project });
        } else {
            const project = await getProjectsController(req);
            return res.status(200).json({ success: true, data: project });
        }
        
    } catch (error) {
        return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
    }
}

async function deleteProjectHandler(req: NextApiRequest, res:NextApiResponse) {
    try {

        const {projectId} = req.query;

        if (!projectId) {
            return res.status(400).json({ error: 'Project Id not found'})
        }

        const project = await deleteProjectController(String(projectId), req)

        return res.status(201).json({ success: true, data: project });
    } catch (error) {
        return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
    }
}


export default applyMiddleware(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        switch(req.method) {
            case 'GET':
                await getProjectsHandler(req, res)
                break
            case 'POST':
                await postProjectHandler(req, res);
                break;
            case 'DELETE':
                await deleteProjectHandler(req, res);
                break;
            default:
                res.status(400).json({ success: false, error: 'Method not allowed' });
        }
        
    } catch (error) {
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Server error' });
    }
});