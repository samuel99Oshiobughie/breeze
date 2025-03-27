import React from 'react'
import { Snackbar, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import MuiAlert from '@mui/material/Alert'

import useBreezeHooks from '@/hooks/useBreezeHooks' 

interface IMySnackbarComponentProps {
  handleCloseSnackbar?: () => void
}

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const SnackbarComponent = (props: IMySnackbarComponentProps) => {

  const {snackbarMessage, setSnackbarMessage, snackbarMessageSeverity } = useBreezeHooks();

  function handleCloseSnackbar() {
    props.handleCloseSnackbar && props.handleCloseSnackbar()
    setSnackbarMessage('')
  }

  return (
    <Snackbar
      style={{ zIndex: 100000 }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={Boolean(snackbarMessage)}
      autoHideDuration={3000}
      onClose={handleCloseSnackbar}
      action={
        <span>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={props.handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </span>
      }
    >

      <span>
        <Alert
          style={{ display: 'flex' }}
          onClose={props.handleCloseSnackbar}
          severity={snackbarMessageSeverity}
        >
          {snackbarMessage}
        </Alert>
      </span>

    </Snackbar>
  )
}

export default SnackbarComponent
