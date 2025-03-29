import React, { useState } from 'react';
import Layout from "@/layout/layout"
import { useRouter } from 'next/router';
import { 
  Box, Typography, Paper, Stack, Card, CardContent, 
  IconButton, Chip, FormControl, InputLabel, Select,
  MenuItem, TextField, Button, Menu
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  ArrowBack,
  Remove as RemoveIcon 
} from '@mui/icons-material';
import TaskModal from './components/taskModal';
import useBreezeHooks from '@/hooks/useBreezeHooks'


const ProjectTasks = () => {
   const {projects, tasks, setTasks, updateTasks, fetchAllTasks } = useBreezeHooks();
   const [searchTerm, setSearchTerm] = useState<string>('');
   const [statusFilter, setStatusFilter] = useState<string>("all");
   const [dueDateFilter, setDueDateFilter] = useState<string>("all");
   const [priorityFilter, setPriorityFilter] = useState<string>("all");
   const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const router = useRouter();
   const { slug } = router.query; 
   
   if (!slug || !Array.isArray(slug) || slug.length < 2) {
     return <p>Invalid project URL</p>; // Handle invalid URLs
    }
    
    const [projectId, projectName] = slug;
    const selectedProject = projects?.find((project) => project._id === projectId);
    const selectedTasks = tasks?.filter((task) => task.projectId === projectId);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddTaskClick = () => {
    setIsModalOpen(true);
    handleMenuClose();
  };

  const handleUpdate = async (taskId: string, projectId?: string) => {

    const taskToUpdate = tasks?.find(t => t._id === taskId );
    if (!taskToUpdate) {
      console.error("Task not found");
      return;
    };

    const updatedCompletedState = {
      completed: !taskToUpdate.completed
    }; 
    
    await updateTasks({taskId: taskId, projectId: projectId, updatedState: updatedCompletedState});

    const taskUpdate = tasks?.map(t => t._id === taskId ? { ...t, ...updatedCompletedState} : t);

    if(taskUpdate) setTasks(taskUpdate);
    // console.log("updated-task: ", taskUpdate)
  };

  const handleRemoveTask = async (taskId: string, projectId?: string) => {
    // console.log(`task-id: ${taskId}, \n project-id: ${projectId} `)

    const updatedProjectId = {
      projectId: 'default_project_id'
    };

    await updateTasks({taskId: taskId, projectId: projectId, updatedState: updatedProjectId});
    await fetchAllTasks.current?.();
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
      setSearchTerm(value.toLowerCase());
  }

  const handleFilterChange = (filter: string, value: string) => {
    if (filter === "status") setStatusFilter(value);
    if (filter === "dueDate") setDueDateFilter(value);
    if (filter === "priority") setPriorityFilter(value);
  };

  const filteredTasks = selectedTasks?.filter((task) => {
    // Search Filter
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm) && !task.description.toLowerCase().includes(searchTerm)) {
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

  return (
    <Layout>
    <Box className="p-6">
      <Box className="flex justify-start mb-4">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/projects')}
          color="inherit"
        >
          Back to Projects
        </Button>
      </Box>

      <Box className="flex flex-col gap-4 slug-med:flex-row justify-between mb-6">
        <Typography variant="h4" className="font-bold">
          {projectName}
        </Typography>
        
        <Box className="flex gap-4 items-center">
          <TextField
            size="small"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearch}
            className="min-w-[200px]"
          />
          
          <Button
            onClick={handleMenuOpen}
            endIcon={<MoreVertIcon />}
            variant="outlined"
          >
            Options
          </Button>
          
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleAddTaskClick}>Add Task</MenuItem>
          </Menu>
        </Box>
      </Box>

      {selectedProject && (
        <Typography variant="h6" className="font-bold">
          {selectedProject.description}
        </Typography>
      )}

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

      <Stack spacing={2}>
        {filteredTasks?.map(task => (
          <Card key={task._id} variant="outlined">
            <CardContent sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              '&:last-child': { pb: 2 }
            }}>
              <IconButton
                onClick={() => handleUpdate(String(task._id), String(task.projectId))}
              >
                <CheckCircleIcon 
                  color={task.completed ? 'success' : 'disabled'}
                  sx={{ fontSize: 28 }}
                />
              </IconButton>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="h6"
                    sx={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? 'text.secondary' : 'text.primary'
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                    size="small"
                  />
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {/* Due {new Date(task.dueDate).toLocaleDateString()} */}
                    Due {new Date(task.dueDate).toISOString().split('T')[0]}
                  </Typography>
                </Stack>
              </Box>

          <Button
            variant="outlined"
            startIcon={<RemoveIcon />}
            className="hover:bg-gray-100"
            title="Remove Task"
            onClick={() => handleRemoveTask(String(task._id), String(task.projectId))}
          />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>

    <TaskModal 
    open={isModalOpen} 
    handleClose={handleModalClose} 
    projId={projectId}
    />
    </Layout>
  );
};

export default ProjectTasks;