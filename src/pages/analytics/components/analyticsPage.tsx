import { useState } from 'react';
import { Typography } from "@mui/material";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import useBreezeHooks from '@/hooks/useBreezeHooks';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const { tasks } = useBreezeHooks();
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Filter tasks based on the selected time frame
  const filterTasksByTimeFrame = (timeFrame: 'daily' | 'weekly' | 'monthly') => {
    const now = new Date();
    return tasks?.filter((task) => {
      const taskDate = new Date(task.dueDate);
      switch (timeFrame) {
        case 'daily':
          return (
            taskDate.getDate() === now.getDate() &&
            taskDate.getMonth() === now.getMonth() &&
            taskDate.getFullYear() === now.getFullYear()
          );
        case 'weekly':
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        case 'monthly':
          return (
            taskDate.getMonth() === now.getMonth() &&
            taskDate.getFullYear() === now.getFullYear()
          );
        default:
          return true;
      }
    });
  };

  // Get filtered tasks
  const filteredTasks = filterTasksByTimeFrame(timeFrame);

  // Calculate completed and incomplete tasks
  const completedTasks = filteredTasks?.filter((task) => task.completed).length;

  const incompleteTasks = filteredTasks!.length - completedTasks!;

  // Calculate tasks by priority
  const tasksByPriority = filteredTasks!.reduce(
    (acc, task) => {
      acc[task.priority].total++;
      if (task.completed) acc[task.priority].completed++;
      return acc;
    },
    {
      high: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      low: { total: 0, completed: 0 },
    }
  );

  // Chart data
  const chartData = {
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        label: 'Tasks',
        data: [completedTasks, incompleteTasks],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Time Frame Menu */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setTimeFrame('daily')}
          className={`px-4 py-2 rounded-lg ${
            timeFrame === 'daily'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-600'
          }`}
        >
          Daily Analysis
        </button>
        <button
          onClick={() => setTimeFrame('weekly')}
          className={`px-4 py-2 rounded-lg ${
            timeFrame === 'weekly'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-600'
          }`}
        >
          Weekly Analysis
        </button>
        <button
          onClick={() => setTimeFrame('monthly')}
          className={`px-4 py-2 rounded-lg ${
            timeFrame === 'monthly'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-600'
          }`}
        >
          Monthly Analysis
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <Typography variant="h5" className="mb-4 font-semibold">
          Task Completion Overview
        </Typography>
        <Line data={chartData} />
      </div>

      {/* Priority Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(tasksByPriority).map(([priority, data]) => (
          <div
            key={priority}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <Typography variant="h6" className="font-semibold mb-4">
              {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority Tasks
            </Typography>
            <Typography variant="body1" className="mb-2">
              Total: {data.total}
            </Typography>
            <Typography variant="body1" className="mb-2">
              Completed: {data.completed}
            </Typography>
            <Typography variant="body1">
              Incomplete: {data.total - data.completed}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;