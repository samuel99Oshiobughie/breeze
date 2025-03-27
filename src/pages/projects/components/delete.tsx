import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

interface IDeleteModal {
    open: boolean,
    onClose : () => void,
    onConfirm: () => void,
    projectTitle: string
}

const DeleteModal = ({ open, onClose, onConfirm, projectTitle }: IDeleteModal) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="delete-task-dialog">
      {/* Modal Title */}
      <DialogTitle id="delete-task-dialog">Delete Project</DialogTitle>

      {/* Modal Content */}
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{projectTitle}</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>

      {/* Actions (Bottom Right Buttons) */}
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
