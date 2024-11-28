"use client";
import React, { useEffect, useState } from "react";
import SummaryCard from "../Components/SummaryCard";
import TableComp from "../Components/TableComp";
import axios from "axios";

// Define a Task interface for type safety
interface Task {
  _id: string;
  title: string;
  priority: number;
  status: "Pending" | "Finished";
  startTime: string; // assuming it comes as a string
  endTime: string; // assuming it comes as a string
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // Use the Task interface here

  // Fetch task data from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://internn-plum.vercel.app/tasks"
        ); // Replace with your API URL
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Calculate the total number of tasks
  const totalTasks = tasks.length;

  // Calculate the number of pending tasks
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;

  // Calculate the number of completed tasks
  const completedTasks = totalTasks - pendingTasks;

  // Calculate total time lapsed (in hours)
  const totalTimeLapsed = tasks.reduce((total, task) => {
    if (task.startTime && task.endTime) {
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Difference in hours
    }
    return total;
  }, 0);

  // Calculate estimated total time to finish
  const totalTimeToFinish = tasks.reduce((total, task) => {
    if (task.endTime) {
      const end = new Date(task.endTime);
      const current = new Date();
      return total + (end.getTime() - current.getTime()) / (1000 * 60 * 60); // Estimated time in hours
    }
    return total;
  }, 0);

  // Table headers
  const tableHeaders = [
    "Task priority",
    "Pending tasks",
    "Time lapsed (hrs)",
    "Time to finish (hrs)",
  ];

  // Format the task data to match the table structure
  const tableData = tasks.map((task) => [
    task.priority, // Assuming task has a 'priority' field
    task.status === "Pending" ? 1 : 0, // Example: filter out pending tasks
    task.startTime && task.endTime
      ? (new Date(task.endTime).getTime() -
          new Date(task.startTime).getTime()) /
        (1000 * 60 * 60)
      : 0, // Calculate time lapsed in hours
    task.endTime
      ? (new Date(task.endTime).getTime() - new Date().getTime()) /
        (1000 * 60 * 60)
      : 0, // Estimate time to finish (in hours)
  ]);

  return (
    <div>
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Total tasks" value={totalTasks} />
        <SummaryCard
          title="Tasks completed"
          value={`${((completedTasks / totalTasks) * 100).toFixed(2)}%`}
        />
        <SummaryCard
          title="Tasks pending"
          value={`${((pendingTasks / totalTasks) * 100).toFixed(2)}%`}
        />
        <SummaryCard
          title="Average time per completed task"
          value={`${(totalTimeLapsed / completedTasks).toFixed(2)} hrs`}
        />
      </section>

      {/* Pending Task Summary */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Pending task summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard title="Pending tasks" value={pendingTasks} />
          <SummaryCard
            title="Total time lapsed"
            value={`${totalTimeLapsed} hrs`}
          />
          <SummaryCard
            title="Total time to finish"
            value={`${totalTimeToFinish} hrs`}
            description="Estimated based on endtime"
          />
        </div>
      </section>

      {/* Pending Task Table */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Pending Task Table</h2>
        <TableComp headers={tableHeaders} rows={tableData} />
      </section>
    </div>
  );
};

export default Dashboard;
