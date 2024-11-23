import mongoose from "mongoose"

export interface IUsers {
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    email: string,
    password: string,
    createAt: Date,
    updateAt: Date,
    createdBy: mongoose.Schema.Types.ObjectId | null,
    userRole: 'user' | 'admin'
}