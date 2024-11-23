
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { RiCloseLine } from "react-icons/ri";

const CreateTask = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [close, setClose] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form Data: ", data);
    // Add API call or further processing logic here
  };

  const onClose = () => {
    setClose(true);
  };

  if (close) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Create Task</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center"
          >
            <RiCloseLine className="text-2xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#171717] mb-1">
              Task Name
            </label>
            <div className="w-full p-2 border-2 rounded-md flex items-center border-[#d7d7dd]">
              <input
                type="text"
                {...register("taskname", { required: "Task Name is required" })}
                className="w-full p-1 outline-none"
              />
            </div>
            {errors.taskname?.message && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.taskname.message)}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#171717] mb-1">
              Task Description
            </label>
            <div className="w-full p-2 border-2 rounded-md flex items-center border-[#d7d7dd]">
              <input
                type="text"
                {...register("task", { required: "Task Description is required" })}
                className="w-full p-1 outline-none"
              />
            </div>
            {errors.task?.message && typeof errors.task.message === 'string' && (
              <p className="text-red-500 text-sm mt-1">{errors.task.message}</p>
            )}
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={disabled}
              className="bg-[#6422f2] border-2 border-[#9260ff] text-white px-8 py-1 rounded-xl"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
