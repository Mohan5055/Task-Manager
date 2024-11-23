import DB from "@app/_database/db";
import userModel from "@app/_model/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await DB()
        const {name, email, password } = await req.json();
        if (!name || !email || !password) {
            return NextResponse.json({
                type: "BAD_REQUEST",
                message: "Email or Password is missing",
            }, { status: 400 });
        }
        await userModel.create({
            name,
            email,
            password,
            createdBy: null 
        });
        return NextResponse.json({
            type: "SUCCESS",
            message: "User created successfully"
        }, { status: 201 });

    } catch (error: any) {
        console.error('User creation error:', error.message);
        return NextResponse.json({
            type: "ERROR",
            message: "Internal server error"
        }, { status: 500 });
    }
}
