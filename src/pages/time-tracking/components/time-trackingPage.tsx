import React, { useState, useEffect } from 'react';
import { 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import useBreezeHooks from '@/hooks/useBreezeHooks';
import { ITask } from '@/interface/interface';


const TimeTrackingPage: React.FC = () => {
  const { tasks, updateTasks, fetchAllTasks } = useBreezeHooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [timeLeftTask, setTimeLeftTask] = useState<{ taskId: string; timeleft: string }[]>([]);

  // Countdown timer logic
  useEffect(() => {
    const updateCountdowns = () => {
      if (tasks) {
        const trackedTasks = tasks
          .filter((t) => t.tracked === true) // Filter tracked tasks
          .map((trackedTask) => ({
            taskId: trackedTask._id,
            timeleft: calculateTimeLeft(trackedTask.dueDate), // Calculate time left
          }));

        setTimeLeftTask(trackedTasks); // Update state with all tracked tasks
      }
    };

    const interval = setInterval(updateCountdowns, 1000); // Update every second
    updateCountdowns(); // Initial call

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [tasks]); // Re-run effect when `tasks` changes


  const calculateTimeLeft = (dueDate: string): string => {
    const dueDateObj = new Date(dueDate);
    const now = new Date();
    const diff = dueDateObj.getTime() - now.getTime();

    if (diff <= 0) return 'Deadline passed';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // Filter tasks based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = tasks?.filter((task) =>{
       return task.tracked === false && task.title.toLowerCase().includes(searchQuery.toLowerCase())
      } 
    );
    filtered && setFilteredTasks(filtered);
    } else {
      setFilteredTasks([]);
    }
  }, [searchQuery, tasks]);

  // Handle task selection
  const handleTaskSelect = (task: ITask) => {
    setSelectedTask(task);
    setSearchQuery(task.title);
    setFilteredTasks([]);
  };

  // Handle start tracking
  const handleStartTracking = async() => {
    if(!selectedTask){
      console.error("No selected task for tracking")
      return;
    }
    // console.log("selected-task: ", selectedTask)

    const trackedTaskState = {
      tracked: true
    }

    await updateTasks({taskId: selectedTask._id, updatedState: trackedTaskState})
    setSelectedTask(null);
    setSearchQuery('');
    fetchAllTasks();
  };

  // Handle delete tracked task
  const handleDeleteTask = async(id: string) => {
    // console.log(id)
    const trackedTaskState = {
      tracked: false
    }

    await updateTasks({taskId: id, updatedState: trackedTaskState})
    fetchAllTasks();
  };



  return (
    <>
      <Head>
        <title>Time Tracking - Productivity App</title>
      </Head>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Search Bar */}
          <Paper elevation={3} className="p-6 mb-6">
            <Typography variant="h6" className="mb-4">
              Search task to track
            </Typography>
            <TextField
              label="Search Task"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              variant="outlined"
            />
            {filteredTasks.length > 0 && (
              <List className="max-h-40 overflow-auto mt-2">
                {filteredTasks.map((task) => (
                  <ListItem
                    key={task._id}
                    button
                    onClick={() => handleTaskSelect(task)}
                  >
                    <ListItemText primary={task.title} />
                  </ListItem>
                ))}
              </List>
            )}
            {selectedTask && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartTracking}
                className="mt-4 w-full"
              >
                Start Tracking
              </Button>
            )}
          </Paper>

          {/* Tracked Tasks */}
          {tasks?.filter(t => t.tracked === true).map(
            (trackedTask) => {
              return ( <Paper key={trackedTask._id} elevation={3} className="p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Typography variant="h6">{trackedTask.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Priority: {trackedTask.priority}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Time Left: {
                          timeLeftTask.find((t) => t.taskId === trackedTask._id)?.timeleft || 'Loading...'
                        }
                      </Typography>  
                    </div>
                    <IconButton
                      onClick={() => handleDeleteTask(trackedTask._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Paper>
              )
            }
          )}
        </div>
      </div>
    </>
  );
};

export default TimeTrackingPage;