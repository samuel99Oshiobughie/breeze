import { ExtendedNextApiRequest } from '@/interface/interface'
import Task, { ITask } from './taskModel';
import { IUpdate } from '@/interface/interface';

interface IFilter {
    _id: string,
    projectId: string,
    userId: string
}


export const createTaskController = async (taskDetails: {
    title: string;
    projectId?: string
    description: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    
}, req: ExtendedNextApiRequest): Promise<ITask> => {
    try {
        const userId = req.sessionId
        // console.log('user-id: ', userId)
        const details = { ...taskDetails, userId}
        const res = await Task.create(details);
        // console.log("TaskRes: ", res)
        return res
    } catch (error) {
        throw new Error(`Error creating task: ${error}`)
    }
};

export const getTasksController = async (req: ExtendedNextApiRequest) => {
    try {
        const userId = req.sessionId
        // console.log('user-id: ', userId)
        return await Task.find({
            userId,
            deleted: {$ne: true}
        })
    } catch (error) {
        throw new Error(`Error getting tasks: ${error}`)
    }
}

export const getProjectTasksController = async (options:{
projectId: string
}, req: ExtendedNextApiRequest) => {
    try {
        const userId = req.sessionId
        // console.log('user-id: ', userId)
        return await Task.find({
            userId,
            projectId: options.projectId,
            deleted: {$ne: true}
        });
    } catch (error) {
        throw new Error(`Error getting project tasks: ${error}`)
    }
};

export const getTaskByIdController = async (options: {
    taskId: string,
    projectId?: string
}, req: ExtendedNextApiRequest) => {
    try {
        const userId = req.sessionId
        // console.log('user-id: ', userId)
        return await Task.findById({
            userId,
            _id: options.taskId,
            projectId: options.projectId
        });
    } catch (error) {
        throw new Error(`Error getting task: ${error}`)
    }
};

export const updateTaskController = async (options: {
    taskId?: string;
    projectId?: string; 
    updateFields?: IUpdate;
}, req: ExtendedNextApiRequest) => {
    try {
        const { taskId, projectId, updateFields } = options;
        const userId = req.sessionId
        // console.log('user-id: ', userId)
        
        if(taskId && taskId !== "undefined"){
            // Ensure there's at least one field to update
            if (!updateFields || Object.keys(updateFields).length === 0) {
                throw new Error('No update fields provided');
            }

            // Define query filter
            const filter: Partial<IFilter> = { _id: taskId, userId };
            if (projectId && projectId !== 'undefined') filter.projectId = projectId; // Add projectId only if provided

            // Update the task
            const updatedTask = await Task.findOneAndUpdate(filter, updateFields, { new: true });
            if (!updatedTask) {
                throw new Error('Task not found or not updated');
            }

            return updatedTask;
        } else {
            const updatedTasks = await Task.updateMany(
                { userId: userId, projectId: projectId}, // Filter: Find all tasks with this projectId
                {$set: {deleted: true }},
            );

            if (!updatedTasks) {
                throw new Error('Tasks not found or not updated');
            }

            return updatedTasks;
        }
    } catch (error) {
        throw new Error(`Error updating task: ${error}`);
    }
};


export const deleteTaskController = async (options: {
    taskId: string,
    projectId?: string
}, req: ExtendedNextApiRequest) => {
    try {
        const userId = req.sessionId
        // console.log('user-id: ', userId)

        const { taskId, projectId} = options;

        const filter: Partial<IFilter> = { _id: taskId, userId };
        if (projectId) filter.projectId = projectId;
        
        const deletedTask = await Task.findOneAndUpdate(filter, {deleted: true}, { new: true });

        if (!deletedTask) {
            throw new Error('Task not found or not updated');
        }

        return deletedTask;
    } catch (error) {
        throw new Error(`Error deleting task: ${error}`)
    }
};