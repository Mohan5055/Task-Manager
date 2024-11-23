
import DB from "@app/_database/db";
import HandleResponse from "@app/_helpers/Handler";
import userModel from "@app/_model/user.model";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { SignJWT } from 'jose';
import { cookies } from 'next/headers'


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

export async function GET(req: Request, res: NextResponse) {
    try {
        DB();
        const user: any = JSON.parse(req.headers.get('user') as string);
        if (!user?.userRole) {
            return HandleResponse({
                type: "BAD_REQUEST",
                message: "User Role not found",
            })
        }
        if (user?.userRole == "admin" || user?.userRole == "user") {
            const users = await userModel.find({ $or: [{ userRole: "admin" }, { userRole: "user" }] }, { _id: 1, email: 1 }).lean();
            return HandleResponse({
                type: "SUCCESS",
                message: "",
                data: { users }
            })
        }
    } catch (error: any) {
        return HandleResponse({
            type: "BAD_REQUEST",
            message: error?.message
        })
    }
}
export async function PUT(req: Request) {
    try {
        DB();
        const { email, password } = await req.json();
        if (!email || !password) {
            return HandleResponse({
                type: "BAD_REQUEST",
                message: "Email Or Password missing"
            })
        }

        const user = await userModel.findOne({ email:new RegExp(email,'i') });

        if (!user) {
            return HandleResponse({
                type: "BAD_REQUEST",
                message: "user not found"
            })
        }

        const comparePassword = bcrypt.compareSync(password, user.password);

        if (!comparePassword) {
            return HandleResponse({
                type: "BAD_REQUEST",
                message: "email or password is incorrect"
            })
        }

        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + (60 * 60 * 24); // 1 day
        const refreshExp = iat + (60 * 60 * 24); // 1 day
        const accesstoken = await new SignJWT({ access: JSON.stringify(user) })
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setExpirationTime(exp)
            .setIssuedAt(iat)
            .setNotBefore(iat)
            .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET!))
        const refreshToken = await new SignJWT({ refresh: JSON.stringify(user) })
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setExpirationTime(refreshExp)
            .setIssuedAt(iat)
            .setNotBefore(iat)
            .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET!))
        ;(await cookies()).set("refreshToken", refreshToken, { expires: new Date((iat + refreshExp) * 1000) })
        ;(await cookies()).set("accessToken", accesstoken, { expires: new Date((iat + (5 * 60)) * 1000)})
        ;(await cookies()).set("accessTokenExpire", new Date((iat + (5 * 60)) * 1000).toISOString(), { expires: new Date((iat + (5 * 60)) * 1000) })
        return HandleResponse({
            type: "SUCCESS",
            message: "Login successfully",
            // data: { accesstoken, refreshToken, email:user.email, role:user?.userRole }
            data:user
        })
    } catch (error: any) {
        return HandleResponse({
            type: "BAD_REQUEST",
            message: error?.message
        })
    }
}
