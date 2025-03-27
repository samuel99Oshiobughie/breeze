import { useState, useEffect } from "react";
import SearchBar from "@/components/search";
import ModalBox from "./modal";
import DeleteModal from "@/components/delete";
import FloatingChatButton from "./chatButton"; // Import the floating chat button
import ChatDrawer from "./chatDrawer"; // Import the chat drawer

import { 
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  IconButton,
  Stack,
  Paper,
  Skeleton 
} from '@mui/material';

import {
  Search,
  Add as AddIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

import useBreezeHooks from '@/hooks/useBreezeHooks'

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low'; 
  createdAt: string;
  updatedAt: string;
}

interface TaskUpdatePayload {
  taskId: string;
  projectId?: string;
  updatedState: {
    completed: boolean;
  };
}

const TasksPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dueDateFilter, setDueDateFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [newMessages, setNewMessages] = useState<number>(0);

  const {tasks, setTasks, fetchAllTasks, submitNewTask, updateTasks, deleteTasks, loading} = useBreezeHooks();

  useEffect(() => {
    fetchAllTasks();
  }, []);
    
  // Chat handlers
  const handleOpenChat = (): void => {
    setIsChatOpen(true);
    setNewMessages(0); // Reset new messages count when opening chat
  };

  const handleCloseChat = (): void => {
    setIsChatOpen(false);
  };

  const getPriorityColor = (priority: 'high'| 'medium' | 'low'): 'error' | 'warning' | 'success' => {
    const colors: Record<'high' | 'medium' | 'low', 'error' | 'warning' | 'success'> = {
      high: 'error',
      medium: 'warning',
      low: 'success'
    };
    return colors[priority] || colors.medium;
  };

  const handleSearch = ({ searchQuery }: { searchQuery: string }): void => {
    setSearchQuery(searchQuery.toLowerCase());
  };
  

  const handleFilterChange = (filter: string, value: string) => {
    if (filter === "status") setStatusFilter(value);
    if (filter === "dueDate") setDueDateFilter(value);
    if (filter === "priority") setPriorityFilter(value);
  };

  const filteredTasks = tasks?.filter((task) => {
    // Search Filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery) && !task.description.toLowerCase().includes(searchQuery)) {
      return false;
    }

    // Status Filter
    if (statusFilter === "completed" && !task.completed) {
      return false;
    }

    // Due Date Filter
    const today = new Date();
    const taskDueDate = new Date(task.dueDate);
    if (dueDateFilter === "today" && taskDueDate.toDateString() !== today.toDateString()) {
      return false;
    }
    if (dueDateFilter === "week") {
      const weekLater = new Date();
      weekLater.setDate(today.getDate() + 7);
      if (taskDueDate < today || taskDueDate > weekLater) {
        return false;
      }
    }
    if (dueDateFilter === "month") {
      if (taskDueDate.getMonth() !== today.getMonth() || taskDueDate.getFullYear() !== today.getFullYear()) {
        return false;
      }
    }

    // Priority Filter
    if (priorityFilter !== "all" && task.priority !== priorityFilter) {
      return false;
    }

    return true;
  });


  const handleOpen = (): void => setIsModalOpen(true);
  const handleClose = (): void => setIsModalOpen(false);

  const handleOpenModal = (task: Task): void => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleUpdate = async (taskId: string, projectId?: string): Promise<void> => {
    const taskToUpdate = tasks?.find(t => t._id === taskId );
    if (!taskToUpdate) {
      console.error("Task not found");
      return;
    };

    const updatedCompletedState = {
      completed: !taskToUpdate.completed
    }; 
    
   const response = await updateTasks({taskId, projectId, updatedState: updatedCompletedState});

   const { _id } = response?.data.data;

    const taskUpdate = tasks?.map(t => t._id === _id ? { ...t, ...updatedCompletedState} : t);

    taskUpdate && setTasks(taskUpdate);
    // console.log("updated-task: ", taskUpdate);
  };

  const handleDelete = async (): Promise<void> => {
    deleteTasks(String(taskToDelete?._id));
    handleCloseModal();
  }

  const handleSubmit = async (taskObject: {
    title: string;
    description: string;
    dueDate: string;
    priority: "high" | "medium" | "low";
  }): Promise<void> => {
    submitNewTask(taskObject);
    handleClose();
  };

  return (
      <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
        <Box className="mb-4">
          <Typography variant="h4" className="font-bold mb-1">
            Tasks
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Manage and track your tasks efficiently
          </Typography>
        </Box>

        <div className="flex flex-wrap flex-col gap-4 md:flex-row md:justify-between w-full">
          <SearchBar onSearch={handleSearch} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            className="min-w-fit max-w-[10rem] bg-black"
          >
            Create Task
          </Button>
        </div>

        <Paper className="p-2 mb-3 bg-gray-50">
          <Stack direction="row" spacing={2} className="items-center flex-wrap gap-2">
            <Box className="flex items-center gap-1">
              <FilterIcon color="action" />
              <Typography variant="body2" className="font-medium">
                Filter by:
              </Typography>
            </Box>

            {/* Filter Select Inputs */}
            <FormControl size="small" sx={{ width: '100%', '@media (min-width: 612px)': { width: '120px',},}}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => handleFilterChange("status", e.target.value)} label="Status">
                <MenuItem value="all">All Tasks</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: '100%', '@media (min-width: 612px)': { width: '120px',},}}>
              <InputLabel>Due Date</InputLabel>
              <Select value={dueDateFilter} onChange={(e) => handleFilterChange("dueDate", e.target.value)} label="Due Date">
                <MenuItem value="all">All Dates</MenuItem>
                <MenuItem value="today">Due Today</MenuItem>
                <MenuItem value="week">Due This Week</MenuItem>
                <MenuItem value="month">Due This Month</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: '100%', '@media (min-width: 612px)': { width: '120px',},}}>
              <InputLabel>Priority</InputLabel>
              <Select value={priorityFilter} onChange={(e) => handleFilterChange("priority", e.target.value)} label="Priority">
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="high">High Priority</MenuItem>
                <MenuItem value="medium">Medium Priority</MenuItem>
                <MenuItem value="low">Low Priority</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {/* Tasks List or Skeleton Loader */}
        <div className="flex flex-col gap-2">
          {loading
            ? Array.from(new Array(5)).map((_, index) => (
                <Card key={index} variant="outlined">
                  <CardContent className="flex items-center gap-2 pb-2">
                    <Skeleton variant="circular" width={32} height={32} />
                    <Box className="flex-1 min-w-0">
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="40%" height={18} />
                    </Box>
                    <Skeleton variant="rectangular" width={24} height={24} />
                  </CardContent>
                </Card>
              ))
            : filteredTasks!== undefined && filteredTasks?.length > 0 ? (
              filteredTasks?.map((task) => (
                <Card key={task._id} variant="outlined">
                  <CardContent className="flex flex-wrap items-center gap-2 pb-2 sm:flex-nowrap sm:justify-between">
                    <IconButton onClick={() => handleUpdate(String(task._id), String(task.projectId))}>
                      <CheckCircleIcon color={task.completed ? "success" : "disabled"} className="text-3xl" />
                    </IconButton>

                    <Box className="flex-1 min-w-0 text-center sm:text-left">
                      <Stack direction="row" spacing={1} className="items-center justify-center sm:justify-start flex-wrap">
                        <Typography
                          variant="h6"
                          className={`${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}
                        >
                          {task.title}
                        </Typography>
                        <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" />
                      </Stack>
                      <Stack direction="row" spacing={1} className="items-center justify-center sm:justify-start mt-0.5">
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2" className="text-gray-500">
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Box>

                    <IconButton onClick={() => handleOpenModal(task)} color="error" className="self-start sm:self-auto">
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              ))): (
                // Empty State
                <div className="flex justify-center flex-grow mt-[90px]">
                  <Typography variant="h6" className="text-gray-500 ">
                    No tasks yet! Start by creating a new one.
                  </Typography>
                </div>
              )
          }
        </div>

        {/* Modals */}
        <ModalBox isModalOpen={isModalOpen} handleClose={handleClose} handleSubmit={handleSubmit} />
        <DeleteModal open={isDeleteModalOpen} onClose={handleCloseModal} onConfirm={handleDelete} taskTitle={String(taskToDelete?.title)} />

        {/* Chat Interface Components */}
        <div className="fixed bottom-5 right-5 z-[30]">
        <FloatingChatButton onClick={handleOpenChat} newMessages={newMessages} />
        </div>
        <ChatDrawer open={isChatOpen} onClose={handleCloseChat} />
      </div>
  );
};

export default TasksPage;