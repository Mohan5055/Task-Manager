import DB from "@app/_database/db";

import userModel from "@app/_model/user.model";
import Task from "@app/_model/task.model";

import {  NextRequest, NextResponse } from "next/server";


export async function GET() {
    DB()
    try {
        const result = await userModel.find();
        return NextResponse.json(result);
    } catch (error) {
        // console.error(error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}


export async function PUT(req: NextRequest) {
    await DB(); // Ensure the database connection is established
  
    try {
      const userId = req.nextUrl.searchParams.get("id"); // Fetching `id` instead of `userId`
      if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
      }
  
      const tasks = await Task.find({ userId });
      return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
  }
  

  // export async function PATCH(req: Request) {
  //   try {
  //     await DB(); // Ensure the database connection is established
  
  //     // Parse the request body
  //     const body = await req.json();
  //     const { id } = body; // Expect `_id` of the task to be passed in the request body
  
  //     // Validate required fields
  //     if (!id) {
  //       return NextResponse.json(
  //         { error: "The id field is required." },
  //         { status: 400 }
  //       );
  //     }
  
  //     // Update the task in the database
  //     const updatedTask = await Task.findByIdAndUpdate(
  //       id,
  //       { isCompleted: true }, // Set `isCompleted` to true
  //       { new: true } // Return the updated document
  //     );
  
  //     if (!updatedTask) {
  //       return NextResponse.json(
  //         { error: "Task not found." },
  //         { status: 404 }
  //       );
  //     }
  
  //     // Return the updated task
  //     return NextResponse.json(updatedTask, { status: 200 });
  //   } catch (error: any) {
  //     console.error("Error updating task:", error.message || error);
  //     return NextResponse.json(
  //       { error: "Failed to update task", details: error.message || error },
  //       { status: 500 }
  //     );
  //   }
  // }



  export async function PATCH(req: Request) {
    try {
      await DB(); // Ensure the database connection is established
  
      // Parse the request body
      const body = await req.json();
      const { id } = body; // Expect `_id` of the task to be passed in the request body
  
      // Validate required fields
      if (!id) {
        return NextResponse.json(
          { error: "The id field is required." },
          { status: 400 }
        );
      }
  
      // Find the task by ID
      const task = await Task.findById(id);
  
      if (!task) {
        return NextResponse.json(
          { error: "Task not found." },
          { status: 404 }
        );
      }
  
      // Update the task's phase based on its current state
      if (!task.isStarted && !task.isCompleted) {
        // Transition from "incomplete" to "starting phase"
        task.isStarted = true;
        task.isCompleted = false;
      } else if (task.isStarted && !task.isCompleted) {
        // Transition from "starting phase" to "completed phase"
        task.isStarted = false;
        task.isCompleted = true;
      }
  
      // Save the updated task
      const updatedTask = await task.save();
  
      // Return the updated task
      return NextResponse.json(updatedTask, { status: 200 });
    } catch (error: any) {
      console.error("Error updating task:", error.message || error);
      return NextResponse.json(
        { error: "Failed to update task", details: error.message || error },
        { status: 500 }
      );
    }
  }
  

