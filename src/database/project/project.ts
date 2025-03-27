import { ExtendedNextApiRequest } from '@/interface/interface'
import Project, { IProject } from './projectModel';

export const createProjectController = async (projectDetails: {
    name: string;
    description: string;
    status: 'Active' | 'Completed' | 'On Hold'; 
}, req: ExtendedNextApiRequest): Promise<IProject> => {
    try {
        // console.log("Creating project with:", projectDetails);
        const userId = req.sessionId
        // console.log('user-id: ', userId)
        const details = { ...projectDetails, userId}
        const project = await Project.create(details);
        // console.log("Project created:", project);
        return project;
    } catch (error) {
        console.error("Error creating project:", error);
        throw new Error(`Error creating project: ${error}`)
    }
};

export const getProjectsController = async (req: ExtendedNextApiRequest) => {
    try {
        const userId = req.sessionId
        // console.log('user-id: ', userId)
        return await Project.find({
            userId,
            deleted: {$ne: true}
        })
    } catch (error) {
        throw new Error(`Error getting projects: ${error}`)
    }
}

export const getProjectByIdController = async (projectId : string, req: ExtendedNextApiRequest) => {
    try {
        const userId = req.sessionId
        // console.log('user-id: ', userId)
        return await Project.findById({
            userId,
            _id: projectId,
        });
    } catch (error) {
        throw new Error(`Error getting project: ${error}`)
    }
};

export const deleteProjectController = async (projectId: string, req: ExtendedNextApiRequest) => {
    try {
        const userId = req.sessionId
        // console.log('user-id: ', userId)
        const deletedProject = await Project.findByIdAndUpdate(
            {_id: projectId, userId},
            {deleted: true},
            {new: true}
        );

        if(!deletedProject){
            throw new Error('Project not found or not updated');
        }

        // console.log("deletedProj: ", deletedProject)
        return deletedProject
    } catch (error) {
        throw new Error(`Error deleting project: ${error}`)
    }
}