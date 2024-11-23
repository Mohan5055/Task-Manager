
"use client";

import Sidebar from "@app/_components/Sidebar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

const Admin = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [showUsers, setShowUsers] = useState([]); // List of users
  const [userTasks, setUserTasks] = useState([]); // List of tasks for a specific user
  const [selectedUser, setSelectedUser] = useState<string | null>(null); // Currently selected user ID for tasks
  const [taskDetails, setTaskDetails] = useState({
    email: "",
    taskName: "",
    description: "",
  });
  const [editTaskDetails, setEditTaskDetails] = useState<any | null>(null); // Task details for editing

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users`);
        const users = res.data;
        const filteredUsers = users.filter((user: any) => !user.isAdmin);
        setShowUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTaskSubmit = async () => {
    if (!taskDetails.email || !taskDetails.taskName || !taskDetails.description) {
      alert("Please fill all fields before submitting.");
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/task`, taskDetails);
      alert("Task assigned successfully!");
      setTaskDetails({ email: "", taskName: "", description: "" });
      setFormVisible(false);
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Failed to assign task!");
    }
  };

  const fetchUserTasks = async (userId: string) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users?id=${userId}`
      );
      setUserTasks(res.data);
      setSelectedUser(userId);
    } catch (error) {
      console.error("Error fetching user tasks:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/task`, {
        data: { id: taskId },
      });
      alert("Task deleted successfully!");
      setUserTasks((prevTasks) => prevTasks.filter((task: any) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task!");
    }
  };

  const handleEditTask = (taskId: string) => {
    const taskToEdit = userTasks.find((task: any) => task._id === taskId);
    if (taskToEdit) {
      setEditTaskDetails(taskToEdit);
    }
  };

  const handleUpdateTask = async () => {
    if (!editTaskDetails.taskName || !editTaskDetails.description) {
      alert("Please fill all fields before updating.");
      return;
    }

    try {
      const updatedTask = {
        id: editTaskDetails._id,
        taskName: editTaskDetails.taskName,
        description: editTaskDetails.description,
      };

      await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/task`, updatedTask);

      alert("Task updated successfully!");
      setEditTaskDetails(null);
      fetchUserTasks(selectedUser!); // Refresh tasks for the selected user
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task!");
    }
  };

  const closeTaskModal = () => {
    setUserTasks([]);
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow bg-white">
        <Sidebar />
        <div className="flex-grow">
          <div className="bg-gray-200 p-4">
            <button
              onClick={() => setFormVisible(!formVisible)}
              className="flex gap-x-2 text-sm border-2 border-gray-300 bg-white font-bold text-[#868da2] items-center px-4 py-2 rounded-lg"
            >
              <IoMdAdd size={18} />
              Create Task
            </button>
          </div>

          {formVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white w-[400px] max-w-full p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Create Task</h2>
                <form>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                      Select User Email
                    </label>
                    <select
                      id="email"
                      name="email"
                      value={taskDetails.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select an Email</option>
                      {showUsers.map((user: any) => (
                        <option key={user._id} value={user.email}>
                          {user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="taskName" className="block text-gray-700 font-bold mb-2">
                      Task Name
                    </label>
                    <input
                      type="text"
                      id="taskName"
                      name="taskName"
                      value={taskDetails.taskName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="Enter task name"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={taskDetails.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="Enter task description"
                    />
                  </div>
                  <div className="flex justify-end gap-x-2">
                    <button
                      type="button"
                      onClick={handleTaskSubmit}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                      Assign
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormVisible(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="p-4">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Sr. No</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {showUsers.length > 0 ? (
                  showUsers.map((item: any, index) => (
                    <tr key={item._id} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.email}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => fetchUserTasks(item._id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                          View Tasks
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selectedUser && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white w-[600px] max-w-full p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Tasks for User</h3>
                  <button onClick={closeTaskModal} className="text-gray-500 hover:text-black">
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userTasks.map((task: any, index) => (
                    <div
                      key={index}
                      className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
                    >
                      <h4 className="text-md font-semibold">{task.taskName}</h4>
                      <p>{task.description}</p>
                      <p
                        className={`mt-2 text-sm font-bold ${task.isCompleted ? "text-green-500" : "text-red-500"
                          }`}
                      >
                        {task.isCompleted ? "Completed" : "Incomplete"}
                      </p>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => handleEditTask(task._id)}
                          className="px-2 py-1 bg-yellow-400 text-white rounded-full flex items-center"
                        >
                          <AiFillEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded-full flex items-center"
                        >
                          <AiFillDelete size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {editTaskDetails && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white w-[400px] max-w-full p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Edit Task</h2>
                <form>
                  <div className="mb-4">
                    <label htmlFor="taskName" className="block text-gray-700 font-bold mb-2">
                      Task Name
                    </label>
                    <input
                      type="text"
                      id="taskName"
                      name="taskName"
                      value={editTaskDetails.taskName}
                      onChange={(e) =>
                        setEditTaskDetails((prev: any) => ({
                          ...prev,
                          taskName: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="Enter task name"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={editTaskDetails.description}
                      onChange={(e) =>
                        setEditTaskDetails((prev: any) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="Enter task description"
                    />
                  </div>
                  <div className="flex justify-end gap-x-2">
                    <button
                      type="button"
                      onClick={handleUpdateTask}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditTaskDetails(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
