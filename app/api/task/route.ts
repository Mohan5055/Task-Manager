import { NextRequest, NextResponse } from "next/server";
import DB from "@app/_database/db";
import Task from "@app/_model/task.model";
import User from "@app/_model/user.model"; // Assuming User model exists for email lookup

export async function POST(req: NextRequest) {
  // Initialize DB connection
  await DB();

  try {
    const body = await req.json(); // Parse JSON body
    const { email, taskName, description ,isCompleted} = body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create and save the task
    const newTask = new Task({
      userId: user._id,
      taskName,
      description,
      isCompleted,
    });

    await newTask.save();

    return NextResponse.json(
      { message: "Task assigned successfully!", task: newTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error assigning task:", error);
    return NextResponse.json(
      { message: "Error assigning task"},
      { status: 500 }
    );
  }
}



export async function GET(req: NextRequest) {
  await DB(); // Ensure the database connection is established

  try {
    const tasks = await Task.find(); // Retrieve all tasks
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}



export async function DELETE(req: Request) {
  try {
    await DB(); // Ensure database connection

    // Parse the incoming request body to get the `id`
    const body = await req.json();
    const { id } = body;

    // Validate the `id` field
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required for deletion." },
        { status: 400 }
      );
    }

    // Delete the task with the given `id`
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json(
        { error: "Task not found or already deleted." },
        { status: 404 }
      );
    }

    // Return a success response
    return NextResponse.json(
      { message: "Task deleted successfully.", task: deletedTask },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting task:", error.message || error);
    return NextResponse.json(
      { error: "Failed to delete task", details: error.message || error },
      { status: 500 }
    );
  }
}


export async function PATCH(req: Request) {
  try {
    await DB(); // Ensure database connection

    // Parse the incoming request body
    const body = await req.json();
    const { id, taskName, description } = body;

    // Validate required fields
    if (!id || !taskName || !description) {
      return NextResponse.json(
        { error: "Task ID, taskName, and description are required." },
        { status: 400 }
      );
    }

    // Update the task in the database
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { taskName, description }, // Update fields
      { new: true } // Return the updated document
    );

    // Return the updated task
    return NextResponse.json(
      { message: "Task updated successfully.", task: updatedTask },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating task:", error.message || error);
    return NextResponse.json(
      { error: "Failed to update task", details: error.message || error },
      { status: 500 }
    );
  }
}