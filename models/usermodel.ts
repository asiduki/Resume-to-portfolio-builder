import mongoose, { Schema } from "mongoose";

export interface IUser {
  name: string;
  username?: string;
  email: string;
  password: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30,
        match: /^[a-z0-9_-]+$/
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    image:{
        type: String
    }
},{timestamps:true});

export default  mongoose.models.User || mongoose.model<IUser>("User", userSchema); 
