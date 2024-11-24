import mongoose from "mongoose";

// Define the Task interface
export interface ITask extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  taskName: string;
  description: string;
  isCompleted: boolean;
  isStarted:boolean,
  createdAt: Date;
}
