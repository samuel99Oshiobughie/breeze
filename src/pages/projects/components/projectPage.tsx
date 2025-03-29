import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ModalBox from './modal';
import DeleteModal from "./delete";
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Grid2, 
  Paper, 
  InputAdornment,
  Menu,
  IconButton,
  MenuItem,
  Skeleton
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  FilterList as FilterListIcon, 
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

import { IProject } from '@/interface/interface';
import useBreezeHooks from '@/hooks/useBreezeHooks'

const MAX_DESCRIPTION_LENGTH = 40;
const MAX_NAME_LENGTH = 24;

const ProjectsPage = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
    const [filterCriteria, setFilterCriteria] = useState({
      status: 'All',
      sortBy: 'lastUpdated'
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const {projects, submitNewProject, fetchAllProjects, deleteProjects, updateTasks, tasks, setTasks, loading } = useBreezeHooks();


    useEffect(() => {
      fetchAllProjects.current?.();
    }, [fetchAllProjects]);
    
  
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, project: IProject) => {
      setAnchorEl(event.currentTarget);
      setSelectedProject(project);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      setSelectedProject(null);
    };
 
    const router = useRouter();
 
    const handleProjectClick = (projectId: string, projectName: string ) => {
      // console.log(`projectId: ${projectId},\n projectName: ${projectName}  `)
     router.push(`/projects/${projectId}/${projectName}`);
   };

    const handleOpenModal = () => {
       setIsDeleteModalOpen(true);
       setAnchorEl(null);
    };
   
    const handleCloseModal = () => {
      setIsDeleteModalOpen(false);
      setSelectedProject(null);
    };

   const handleDelete = () => {
    deleteProjects(String(selectedProject?._id));

    updateTasks({projectId: String(selectedProject?._id)})
    const taskUpdate = tasks?.filter((t) => t.projectId !== selectedProject?._id)
    if(taskUpdate) {
      setTasks(taskUpdate);
    } 

    setIsDeleteModalOpen(false);
    setSelectedProject(null);
   }
  
  
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value.toLowerCase());
    };
  
    const handleFilterOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
      setFilterAnchorEl(event.currentTarget);
    };
  
    const handleFilterClose = () => {
      setFilterAnchorEl(null);
    };

    const handleFilterChange = (status: string) => {
      setFilterCriteria({ ...filterCriteria, status });
      handleFilterClose();
    };

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    const handleSubmit = async (projectObject: {
        name: string;
        description: string;
        status: 'Active' | 'Completed' | 'On Hold';
      }) => {
        submitNewProject(projectObject)
        handleClose();
      };
  
    // Filtered and searched projects
    const filteredProjects = projects?.filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCriteria.status === 'All' || project.status === filterCriteria.status)
    );
 
   return (
        <Box className="p-6 bg-gray-50 min-h-screen">
       <Box className="flex flex-col proj-small:flex-row justify-between proj-small:items-center mb-6 gap-3">
         <Typography variant="h4" className="font-bold text-gray-800">
           Projects
         </Typography>
         <Button 
           variant="contained" 
           color="primary" 
           startIcon={<AddIcon />}
           onClick={handleOpen}
           className="bg-blue-600 hover:bg-blue-700"
         >
           New Project
         </Button>
       </Box>
 
       <Box className="mb-6 flex space-x-4">
         <TextField
           fullWidth
           variant="outlined"
           placeholder="Search projects..."
           value={searchTerm}
           onChange={handleSearch}
           slotProps={{
             input: {
               startAdornment: (
                 <InputAdornment position="start">
                   <SearchIcon />
                 </InputAdornment>
               ),}
           }}
           className="bg-white"
         />
         
         <Button 
           variant="outlined" 
           startIcon={<FilterListIcon />}
           onClick={handleFilterOpen}
           className="bg-white p-3 text-xs"
         >
           Filters
         </Button>
 
         <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem onClick={() => handleFilterChange('Active')}>Active Projects</MenuItem>
            <MenuItem onClick={() => handleFilterChange('Completed')}>Completed Projects</MenuItem>
            <MenuItem onClick={() => handleFilterChange('On Hold')}>On Hold Projects</MenuItem>
            <MenuItem onClick={() => handleFilterChange('All')}>All Projects</MenuItem>
          </Menu>
       </Box>
 
       <Grid2 container spacing={3}>
       {loading ? (
          <Grid2 container spacing={3}>
            {Array.from(new Array(6)).map((_, index) => (
              <Grid2 key={index} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Paper elevation={3} className="p-4">
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="90%" height={20} />
                  <Skeleton variant="text" width="80%" height={20} />
                  <Box className="flex justify-between items-center mt-4">
                    <Skeleton variant="rectangular" width={80} height={20} />
                    <Skeleton variant="text" width={100} height={20} />
                  </Box>
                </Paper>
              </Grid2>
            ))}
          </Grid2>
        ) : filteredProjects!== undefined && filteredProjects?.length > 0 ? (filteredProjects?.map(project => (
           <Grid2 
           key={project._id} 
           columns={{ xs: 4, sm: 8, md: 12 }}
           >
             <Paper 
               elevation={3} 
               className=" p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
             >
                <div className='flex justify-end'>
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent Grid click
                      handleMenuOpen(e, project);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>

               <Typography variant="h6" className="font-semibold mb-2">
                 {project.name.length > MAX_NAME_LENGTH
                 ? `${project.name.substring(0, MAX_NAME_LENGTH)}...`
                 : project.name}
               </Typography>

               <Typography variant="body2" color="textSecondary" className="mb-4 pb-2">
               {project.description.length > MAX_DESCRIPTION_LENGTH
                ? `${project.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
                : project.description}
               </Typography>

               <Box className="flex justify-between items-center">
                 <Typography 
                   variant="caption" 
                   className={`px-2 py-1 rounded-full text-xs ${
                     project.status === 'Active' 
                       ? 'bg-green-100 text-green-800'
                       : project.status === 'Completed'
                       ? 'bg-blue-100 text-blue-800'
                       : 'bg-yellow-100 text-yellow-800'
                   }`}
                 >
                   {project.status}
                 </Typography>
                 <Typography variant="caption" color="textSecondary">
                 Updated: {new Date(project.updatedAt).toISOString().split('T')[0]}
                 </Typography>
               </Box>
             </Paper>
           </Grid2>
         ))): (
          <div className="flex flex-col items-center justify-center flex-grow mt-[90px]">
            <Typography variant="h6" className="text-gray-500 mt-4">
              No projects yet! Start by creating a new one.
            </Typography>
          </div>
         )
      }
         {/* Menu for "More Options" */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => {
              if(selectedProject) {
              handleProjectClick(selectedProject?._id, selectedProject?.name)
              }
              }}>Open</MenuItem>
            <MenuItem onClick={() => {
              handleOpenModal()
            }}>Delete</MenuItem>
          </Menu>
       </Grid2>

       <div>
          <ModalBox 
          isModalOpen={ isModalOpen}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          />
          <DeleteModal
            open={isDeleteModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleDelete}
            projectTitle={String(selectedProject?.name)}
          />
        </div>
     </Box>
     
   );
 };
 
 export default ProjectsPage;