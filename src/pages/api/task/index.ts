import { NextApiRequest, NextApiResponse } from 'next';
import { 
    createTaskController, 
    getTasksController, 
    getProjectTasksController, 
    getTaskByIdController, 
    updateTaskController, 
    deleteTaskController
} from '@/database/task/task'
import { applyMiddleware } from '@/lib/middleware';



async function postTaskHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const task = await createTaskController(req.body, req);
        return res.status(201).json({ success: true, data: task });
        
    } catch (error) {
        return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
    }
}

async function getTasksHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { projectId, taskId } = req.query; 
        // throw new Error('testing error')  
        if (taskId) {
            const task = await getTaskByIdController({ taskId: String(taskId), projectId: String(projectId) }, req);
            return res.status(200).json({ success: true, data: task });

        } else if (projectId) {
            const tasks = await getProjectTasksController({ projectId: String(projectId) }, req);
            return res.status(200).json({ success: true, data: tasks });

        } else {
            const tasks = await getTasksController(req);
            return res.status(200).json({ success: true, data: tasks });

        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
    }
}


async function updateTaskHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'PUT') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const { taskId, projectId } = req.query;
        
        if (taskId) {

            const updateFields = req.body; 
    
    
            const task = await updateTaskController({
                taskId: taskId as string,
                projectId: projectId as string | undefined, 
                updateFields: updateFields, 
            }, req);
    
            return res.status(200).json({ success: true, data: task });
        } else {

            const task = await updateTaskController({
                projectId: projectId as string
            }, req);

            return res.status(200).json({ success: true, data: task });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
    }
}



async function deleteTaskHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { taskId, projectId } = req.query;

        if (!taskId) {
            return res.status(400).json({ error: 'Task Id not found'})
        }

        const task = await deleteTaskController({
            taskId: taskId as string, 
            projectId: projectId as string | undefined
        }, req);

        return res.status(200).json({ success: true, data: task });
        
    } catch (error) {
        return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
    }
}

export default applyMiddleware(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      switch (req.method) {
        case 'GET':
          await getTasksHandler(req, res);
          break;
        case 'PUT':
          await updateTaskHandler(req, res);
          break;
        case 'DELETE':
          await deleteTaskHandler(req, res);
          break;
        case 'POST':
          await postTaskHandler(req, res);
          break;
        default:
          res.status(400).json({ success: false, error: 'Method not allowed' });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Server error' });
    }
  });

