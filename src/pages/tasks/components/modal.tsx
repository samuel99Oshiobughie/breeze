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


type priorityType = "high" | "medium" | "low"


interface ModalBoxProps {
    isModalOpen: boolean;
    handleClose: () => void;
    handleSubmit: (taskObject: {
      title: string;
      description: string;
      dueDate: string;
      priority: priorityType;
    }) => void;
}


const ModalBox = ({
    isModalOpen, 
    handleClose,
    handleSubmit
}: ModalBoxProps) => {

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [priority, setPriority] = useState<priorityType>("medium");

    const handleChange = (event: SelectChangeEvent<string>) => {
      setPriority(event.target.value as priorityType);
    };


    const taskObject = {
      title: title,
      description: description,
      dueDate: date,
      priority: priority,
    };

    const submit = () => {
      handleSubmit(taskObject)
      setTitle("")
      setDescription("")
      setDate("")
      setPriority("medium")
      handleClose()
    }


return (
<>
  {/* Create Task Modal */}
  <Dialog open={isModalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
    <DialogTitle>Create New Task</DialogTitle>
    <DialogContent>
      <Stack spacing={3} sx={{ mt: 2 }}>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <TextField
          label="Due Date"
          type="date"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select 
          defaultValue="medium" 
          label="Priority"
          value={priority}
          onChange={handleChange}
          >
            <MenuItem value="high">High Priority</MenuItem>
            <MenuItem value="medium">Medium Priority</MenuItem>
            <MenuItem value="low">Low Priority</MenuItem>
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