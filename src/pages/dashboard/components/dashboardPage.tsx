import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Button,
  Grid,
  Box,
  Container,
} from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { ITask } from '@/interface/interface';
import useBreezeHooks from '@/hooks/useBreezeHooks';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';

const HomePage: React.FC = () => {
  const { tasks } = useBreezeHooks();
  const [currentTask, setCurrentTask] = useState<ITask | null>(null);
  const [upcomingTask, setUpcomingTask] = useState<ITask | null>(null);
  const [timeLeftTask, setTimeLeftTask] = useState<string>('');
  const [timeLeftUpcomingTask, setTimeLeftUpcomingTask] = useState<string>('');

  // Extract the two closest upcoming tasks
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const futureTasks = tasks
        .filter((task) => new Date(task.dueDate).getTime() > Date.now())
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

      if (futureTasks.length > 0) {
        setCurrentTask(futureTasks[0]);
        setUpcomingTask(futureTasks.length > 1 ? futureTasks[1] : null);
      } else {
        setCurrentTask(null);
        setUpcomingTask(null);
      }
    }
  }, [tasks]);

  // Countdown timer logic for currentTask
  useEffect(() => {
    const updateCountdown = () => {
      if (currentTask) {
        setTimeLeftTask(calculateTimeLeft(new Date(currentTask.dueDate)));
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, [currentTask]);

  // Countdown timer logic for upcomingTask
  useEffect(() => {
    const updateCountdown = () => {
      if (upcomingTask) {
        setTimeLeftUpcomingTask(calculateTimeLeft(new Date(upcomingTask.dueDate)));
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, [upcomingTask]);

  const calculateTimeLeft = (deadline: Date): string => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();

    if (diff <= 0) return 'Deadline passed';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <>
      <Head>
        <title>Home - Productivity App</title>
      </Head>
      <div className="min-h-screen bg-gray-50 font-inter">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
          <Container maxWidth="lg">
            <div className="text-center text-white">
              <Typography variant="h2" className="font-bold mb-4">
                Boost Your Productivity
              </Typography>
              <Typography variant="h6" className="mb-8">
                Track time, manage goals, and achieve more with our powerful tools
              </Typography>
              {/* <Button
                variant="contained"
                color="secondary"
                size="large"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Get Started
              </Button> */}
            </div>
          </Container>
        </div>

        {/* Dashboard Content */}
        <Container maxWidth="lg" className="py-12">
          <Grid container spacing={4}>
            {/* Current Task */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} className="p-6 h-full">
                <Typography variant="h5" className="mb-4 font-semibold">
                  Current Task
                </Typography>
                {currentTask ? (
                  <Box>
                    <Typography variant="h6" className="mb-2 font-medium">
                      {currentTask.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-2">
                      Deadline: {new Date(currentTask.dueDate).toLocaleString()}
                    </Typography>
                    <Typography variant="h6" className="text-red-500 font-semibold">
                      Time Left: {timeLeftTask}
                    </Typography>
                    <Link href="/time-tracking" passHref>
                      <Button variant="outlined" className="mt-4">
                        Track Time
                      </Button>
                    </Link>
                  </Box>
                ) : (
                  <Typography>No active task</Typography>
                )}
              </Paper>
            </Grid>

            {/* Upcoming Task */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} className="p-6 h-full">
                <Typography variant="h5" className="mb-4 font-semibold">
                  Upcoming Task
                </Typography>
                {upcomingTask ? (
                  <Box>
                    <Typography variant="h6" className="mb-2 font-medium">
                      {upcomingTask.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-2">
                      Deadline: {new Date(upcomingTask.dueDate).toLocaleString()}
                    </Typography>
                    <Typography variant="h6" className="text-red-500 font-semibold">
                      Time Left: {timeLeftUpcomingTask}
                    </Typography>
                    <Link href="/time-tracking" passHref>
                      <Button variant="outlined" className="mt-4">
                        Track Time
                      </Button>
                    </Link>
                  </Box>
                ) : (
                  <Typography>No upcoming task</Typography>
                )}
              </Paper>
            </Grid>

            {/* Productivity Tips Banner */}
            <Grid item xs={12}>
              <Paper elevation={3} className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                <Typography variant="h5" className="mb-6 font-semibold">
                  Productivity Tip
                </Typography>
                <Typography variant="body1" className="mb-6">
                  Use the Pomodoro Technique: Work for 25 minutes, then take a 5-minute break. Repeat 4 times, then take a longer break.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AccessTimeIcon />}
                >
                  Learn More
                </Button>
              </Paper>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12}>
              <Paper elevation={3} className="p-6">
                <Typography variant="h5" className="mb-6 font-semibold">
                  Quick Actions
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Link href="/time-tracking" passHref>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<AccessTimeIcon />}
                        className="h-24"
                      >
                        Track Time
                      </Button>
                    </Link>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Link href="/reports" passHref>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<AssessmentIcon />}
                        className="h-24"
                      >
                        View Reports
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Motivational Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-12">
          <Container maxWidth="lg">
            <div className="text-center text-white">
              <Typography variant="h4" className="font-bold mb-4">
              &ldquo;The key to productivity is to work smarter, not harder.&rdquo;
              </Typography>
              <Typography variant="body1">
                Start organizing your work and life today!
              </Typography>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default HomePage;