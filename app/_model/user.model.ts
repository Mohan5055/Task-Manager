import { Users } from "@app/_const/const";
import { IUsers } from "@app/_interface/user.interface";
import { Schema, model, models } from "mongoose";
import hash from 'bcrypt';

const userSchema = new Schema<IUsers>({
    name : {
        type:String,
        required:true,
        trim:true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: new Date()
    },
    updateAt: {
        type: Date,
        default: new Date()
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: Users.schemaName,
    },
    userRole: {
        type: String,
        enum: ['user', 'admin'],
        default: "user",
        required: true
    }
}, { timestamps: true });  


userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        next()
    }
  this.password = await hash.hash(this.password!, 10)
})

export default models[Users.schemaName] || model<IUsers>(Users.schemaName, userSchema);
