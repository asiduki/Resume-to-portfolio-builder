import { Schema } from "mongoose";
import { IExperience } from "./portfolio.types";

export const experienceSchema = new Schema<IExperience>(
  {
    company: { type: String, default: "" },
    position: { type: String, default: "" },
    employmentType: { type: String, default: "" },
    location: { type: String, default: "" },
    duration: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);
