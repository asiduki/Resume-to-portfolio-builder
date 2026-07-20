import mongoose, { Schema } from "mongoose";

export interface IUser {
  name: string;
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
