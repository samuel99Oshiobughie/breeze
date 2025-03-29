import React, {useState} from "react";
import { 
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    FormControl,
    InputLabel, 
    Stack,
} from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';


type statusType = 'Active' | 'Completed' | 'On Hold';


interface ModalBoxProps {
    isModalOpen: boolean;
    handleClose: () => void;
    handleSubmit: (projectObject: {
      name: string;
      description: string;
      status: statusType;
    }) => void;
}


const ModalBox = ({
    isModalOpen, 
    handleClose,
    handleSubmit
}: ModalBoxProps) => {

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<statusType>("Active");

    const handleChange = (event: SelectChangeEvent<string>) => {
      setStatus(event.target.value as statusType);
    };


    const projectObject = {
      name: name,
      description: description,
      status: status,
    };

    const submit = () => {
      handleSubmit(projectObject)
      setName("")
      setDescription("")
      setStatus("Active")
      handleClose()
    }


return (
<>
  {/* Create Task Modal */}
  <Dialog open={isModalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
    <DialogTitle>Create New Project</DialogTitle>
    <DialogContent>
      <Stack spacing={3} sx={{ mt: 2 }}>
        <TextField
          label="Title"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task title"
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
        />
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select 
          defaultValue="medium" 
          label="Priority"
          value={status}
          onChange={handleChange}
          >
            <MenuItem value="Active">Project Active</MenuItem>
            <MenuItem value="Completed">Project Completed</MenuItem>
            <MenuItem value="On Hold">Project On-Hold</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button variant="contained" onClick={submit}>
        Create
      </Button>
    </DialogActions>
  </Dialog>
</>
);
};

export default ModalBox;