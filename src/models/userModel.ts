import { Schema, model, Document } from "mongoose";

export interface IUser extends Document{
    name: string;
    email:string;
    password:string;
    phone:string;
    image:string;
    isBlocked:boolean
    isAdmin:boolean;
}

const userSchema = new Schema<IUser>({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,

    },
    image:{
        type:String,
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    
    isAdmin:{
        type:Boolean,
        default:false
    }
});

export const User = model<IUser>("User",userSchema)