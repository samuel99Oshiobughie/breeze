import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  LinearProgress,
  Checkbox,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import Head from 'next/head';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  completed: boolean;
  createdAt: Date;
}

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');

  const addGoal = () => {
    if (newGoalTitle.trim()) {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: newGoalTitle.trim(),
        description: newGoalDescription.trim(),
        progress: 0,
        completed: false,
        createdAt: new Date(),
      };
      setGoals((prev) => [...prev, newGoal]);
      setNewGoalTitle('');
      setNewGoalDescription('');
    }
  };

  const updateProgress = (id: string, newProgress: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              progress: Math.max(0, Math.min(100, newProgress)),
              completed: newProgress >= 100,
            }
          : goal
      )
    );
  };

  const toggleComplete = (id: string) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? { ...goal, completed: !goal.completed, progress: !goal.completed ? 100 : goal.progress }
          : goal
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  return (
    <>
      <Head>
        <title>Goals - Productivity App</title>
      </Head>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Paper elevation={3} className="p-6">
            <Typography variant="h4" className="mb-6 text-center">
              My Goals
            </Typography>

            {/* Add New Goal Form */}
            <div className="flex flex-col gap-4 mb-8">
              <TextField
                label="Goal Title"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                variant="outlined"
                className="w-full"
              />
              <TextField
                label="Description"
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                variant="outlined"
                multiline
                rows={2}
                className="w-full"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={addGoal}
                disabled={!newGoalTitle.trim()}
                className="w-full max-w-xs self-center"
              >
                Add Goal
              </Button>
            </div>

            {/* Goals List */}
            {goals.length > 0 ? (
              <List className="space-y-4">
                {goals.map((goal) => (
                  <ListItem key={goal.id} className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center w-full">
                      <Checkbox
                        checked={goal.completed}
                        onChange={() => toggleComplete(goal.id)}
                      />
                      <ListItemText
                        primary={<span className={goal.completed ? 'line-through' : ''}>{goal.title}</span>}
                        secondary={goal.description}
                      />
                      
                      <IconButton edge="end" aria-label="delete" onClick={() => deleteGoal(goal.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                    <div className="w-full flex items-center gap-4">
                      <LinearProgress
                        variant="determinate"
                        value={goal.progress}
                        className="flex-grow"
                      />
                      <Typography variant="body2">{`${goal.progress}%`}</Typography>
                      <TextField
                        type="number"
                        value={goal.progress}
                        onChange={(e) => updateProgress(goal.id, parseInt(e.target.value) || 0)}
                        className="w-20"
                        size="small"
                        inputProps={{ min: 0, max: 100 }}
                        disabled={goal.completed}
                      />
                    </div>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography className="text-center text-gray-500">
                No goals yet. Add one to get started!
              </Typography>
            )}
          </Paper>
        </div>
      </div>
    </>  
  );
};

export default GoalsPage;