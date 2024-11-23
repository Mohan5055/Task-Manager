import mongoose, { Schema, Model } from "mongoose";
import { ITask } from "@app/_interface/task.interface"; // Importing the Task interface

// Define the Task schema
const TaskSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  taskName: { type: String, required: true },
  description: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Export the Task model, or create it if it doesn't already exist
const TaskModel: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default TaskModel;
