"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ls from "localstorage-slim";
import Sidebar from "@app/_components/Sidebar";

interface Task {
  _id: string;
  taskName: string;
  description: string;
  isCompleted: boolean;
}

interface TaskCardsProps {
  userId: string;
}

const TaskCards: React.FC<TaskCardsProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const userId = ls.get("i", { encrypt: true });
  console.log("userId",userId)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.put<Task[]>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users?id=${userId}`
        );
        console.log("response.data",response.data)
        setTasks(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks");
      }
    };

    fetchTasks();
  }, [userId]);

  const handleCompleteTask = async (taskId: string) => {
    console.log("Task ID to complete:", taskId);
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users`, // Ensure correct API route
        { id: taskId } // Send the task ID in the request body
      );
  
      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, isCompleted: true } : task
          )
        );
      }
    } catch (err) {
      console.error("Error completing task:", err);
      setError("Failed to complete task");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow bg-white">
        <Sidebar />
        <div className="flex flex-col items-center py-4 w-full">
          {error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">No tasks available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{task.taskName}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <button
                    className={`mt-4 px-4 py-2 rounded-md text-white font-medium ${
                      task.isCompleted
                        ? "bg-green-500 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    onClick={() => handleCompleteTask(task._id)}
                    disabled={task.isCompleted}
                  >
                    {task.isCompleted ? "Completed" : "Complete Task"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCards;


