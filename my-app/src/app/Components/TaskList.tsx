"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskList = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editTask, setEditTask] = useState<any | null>(null);
  const [newTask, setNewTask] = useState<any>({
    title: "",
    priority: 1,
    status: "Pending",
    startTime: "",
    endTime: "",
  });
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] =
    useState<boolean>(false);
  const [selectedTasks, setSelectedTasks] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortConfig, setSortConfig] = useState<any>({
    key: "",
    direction: "asc",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://internn-plum.vercel.app/tasks"
        ); // Your API endpoint here
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching tasks:", error);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTaskSubmit = async () => {
    try {
      const response = await axios.post(
        "https://internn-plum.vercel.app/tasks",
        newTask
      );
      setTasks((prev) => [...prev, response.data]);
      setIsAddTaskModalOpen(false);
      setNewTask({
        title: "",
        priority: 1,
        status: "Pending",
        startTime: "",
        endTime: "",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEdit = (task: any) => {
    setEditTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handleUpdateTask = async (updatedTask: any) => {
    try {
      const response = await axios.put(
        `https://internn-plum.vercel.app/tasks/${updatedTask._id}`,
        updatedTask
      );
      setTasks((prev: any) =>
        prev.map((task: any) =>
          task._id === updatedTask._id ? response.data : task
        )
      );
      setIsEditTaskModalOpen(false);
      setEditTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleSort = (key: string) => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    const sortedData = [...tasks].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSortConfig({ key, direction });
    setTasks(sortedData);
  };

  const handleStatusToggle = async (taskId: any, currentStatus: string) => {
    const newStatus = currentStatus === "Pending" ? "Finished" : "Pending";
    try {
      const response = await axios.put(
        `https://internn-plum.vercel.app/tasks/${taskId}`,
        { status: newStatus }
      );
      setTasks((prev: any) =>
        prev.map((task: any) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const filteredTasks = tasks.filter((task: any) => {
    if (filterStatus === "All") return true;
    return task.status === filterStatus;
  });

  const handleCheckboxChange = (taskId: any) => {
    setSelectedTasks((prev: any) =>
      prev.includes(taskId)
        ? prev.filter((id: any) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) =>
          axios.delete(`https://internn-plum.vercel.app/tasks/${taskId}`)
        )
      );
      setTasks((prev: any) =>
        prev.filter((task: any) => !selectedTasks.includes(task._id))
      );
      setSelectedTasks([]);
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">Task List</h1>
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Add task
        </button>
      </header>

      {/* Filter Section */}
      <div className="my-4 gap-4 flex flex-row">
        <div>
          <button
            onClick={() => setFilterStatus("All")}
            className=" bg-gray-300 text-white rounded-3xl hover:bg-gray-400 w-28 h-8"
          >
            All
          </button>
        </div>
        <div>
          <button
            onClick={() => setFilterStatus("Pending")}
            className=" bg-yellow-400 text-white rounded-3xl hover:bg-yellow-400 w-28 h-8 "
          >
            Pending
          </button>
        </div>
        <div>
          <button
            onClick={() => setFilterStatus("Finished")}
            className=" bg-green-300 text-white rounded-3xl hover:bg-green-400 w-28 h-8"
          >
            Finished
          </button>
        </div>
      </div>

      {/* Table Section */}
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedTasks(
                    e.target.checked
                      ? filteredTasks.map((task: any) => task._id)
                      : []
                  )
                }
                checked={selectedTasks.length === filteredTasks.length}
                className="cursor-pointer"
              />
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("title")}
            >
              Title
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("priority")}
            >
              Priority
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("status")}
            >
              Status
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("startTime")}
            >
              Start Time
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("endTime")}
            >
              End Time
            </th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task._id} className="border-t border-b hover:bg-gray-100">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedTasks.includes(task._id)}
                  onChange={() => handleCheckboxChange(task._id)}
                  className="cursor-pointer"
                />
              </td>
              <td className="px-4 py-2">{task.title}</td>
              <td className="px-4 py-2">{task.priority}</td>
              <td className="px-4 py-2">{task.status}</td>
              <td className="px-4 py-2">{task.startTime}</td>
              <td className="px-4 py-2">{task.endTime}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleStatusToggle(task._id, task.status)}
                  className="px-4 py-2 ml-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Toggle Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Selected Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleDeleteSelected}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete Selected
        </button>
      </div>

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <form onSubmit={handleAddTaskSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="mt-1 px-4 py-2 w-full border rounded"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="priority" className="block text-sm font-medium">
                  Priority
                </label>
                <input
                  type="number"
                  id="priority"
                  className="mt-1 px-4 py-2 w-full border rounded"
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  className="mt-1 px-4 py-2 w-full border rounded"
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Finished">Finished</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium"
                >
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  className="mt-1 px-4 py-2 w-full border rounded"
                  value={newTask.startTime}
                  onChange={(e) =>
                    setNewTask({ ...newTask, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endTime" className="block text-sm font-medium">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  className="mt-1 px-4 py-2 w-full border rounded"
                  value={newTask.endTime}
                  onChange={(e) =>
                    setNewTask({ ...newTask, endTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditTaskModalOpen && editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={() => handleUpdateTask(editTask)}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="mt-1 px-4 py-2 w-full border rounded"
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask({ ...editTask, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="priority" className="block text-sm font-medium">
                  Priority
                </label>
                <input
                  type="number"
                  id="priority"
                  className="mt-1 px-4 py-2 w-full border rounded"
                  value={editTask.priority}
                  onChange={(e) =>
                    setEditTask({ ...editTask, priority: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  className="mt-1 px-4 py-2 w-full border rounded"
                  value={editTask.status}
                  onChange={(e) =>
                    setEditTask({ ...editTask, status: e.target.value })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Finished">Finished</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium"
                >
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  className="mt-1 px-4 py-2 w-full border rounded"
                  value={editTask.startTime}
                  onChange={(e) =>
                    setEditTask({ ...editTask, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endTime" className="block text-sm font-medium">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  className="mt-1 px-4 py-2 w-full border rounded"
                  value={editTask.endTime}
                  onChange={(e) =>
                    setEditTask({ ...editTask, endTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditTaskModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
