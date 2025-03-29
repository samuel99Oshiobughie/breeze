import React from 'react';
import { 
    Box, 
    Typography,
    Card, 
    CardContent, 
    IconButton,
    Button,
    Modal
  } from '@mui/material';
  import {
    Close as CloseIcon,
    Add as AddIcon 
  } from '@mui/icons-material';

  import useBreezeHooks from '@/hooks/useBreezeHooks';


  const TaskModal = ({ open, handleClose, projId }:{open: boolean, handleClose: () => void, projId: string}) => {
    const {tasks, updateTasks, fetchAllTasks} = useBreezeHooks();

    const handleAddTask = async (taskId: string, projectId?: string) => {
        // console.log(`task-id: ${taskId}, \n project-id: ${projectId}`)

        const updatedProjectId = {
            projectId: projId
        };

        await updateTasks({taskId: taskId, projectId: projectId, updatedState: updatedProjectId}); 
        handleClose();
        await fetchAllTasks.current?.();
    };

  
    return (
      <Modal open={open} onClose={handleClose} >
        <Box className="fixed inset-0 flex items-center justify-center p-4">
          <Box className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
            <div className='flex justify-end'>
              <IconButton
                onClick={handleClose}
                className="absolute top-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </div>

            <Typography variant="h6" className="font-bold">
              Add Task
            </Typography>
  
            <div className="max-h-[70vh] overflow-y-auto p-6">
              {tasks?.filter(t => t.projectId === 'default_project_id').map((task) => (
                <Card key={task._id} className="mb-4">
                  <CardContent className="flex justify-between items-center">
                    <Box className="text-left">
                      <Typography variant="h6">{task.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Priority: {task.priority}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Due Date: {task.dueDate}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      className="hover:bg-gray-100"
                      title="Add Task"
                      onClick={() => handleAddTask(String(task._id), String(task.projectId))}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </Box>
        </Box>
      </Modal>
    );
  };

  export default TaskModal;
  