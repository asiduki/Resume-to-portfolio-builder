import { Schema } from "mongoose";
import { IEducation } from "./portfolio.types";

export const educationSchema = new Schema<IEducation>(
  {
    institution: { type: String, default: "" },
    degree: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
    duration: { type: String, default: "" },
    grade: { type: String, default: "" },
  },
  { _id: false }
);
