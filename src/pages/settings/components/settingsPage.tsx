import React, { useState } from 'react';
import { Typography, Paper, TextField, Grid2, Button, Switch, FormControlLabel } from '@mui/material';
import Head from 'next/head';

const SettingsPage: React.FC = () => {
  const [username, setUsername] = useState('JohnDoe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    console.log({ username, email, notifications });
    // Save logic here
  };

  return (
    <>
      <Head>
        <title>Settings - Productivity App</title>
      </Head>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Paper elevation={3} className="p-6">
            <Typography variant="h4" className="mb-6 text-center">
              Settings
            </Typography>

            <Grid2 container spacing={3} columns={{ xs: 12 }}>
              <Grid2 component="div">
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </Grid2>
              <Grid2 component="div">
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </Grid2>
              <Grid2 component="div">
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                    />
                  }
                  label="Enable Notifications"
                />
              </Grid2>
              <Grid2 component="div" className="text-center">
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              </Grid2>
            </Grid2>
          </Paper>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;