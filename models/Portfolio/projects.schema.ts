import { Schema } from "mongoose";
import { IProject } from "./portfolio.types";

export const projectSchema = new Schema<IProject>(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    github: { type: String, default: "" },
    liveDemo: { type: String, default: "" },
    image: { type: String, default: "" },
    highlights: { type: [String], default: [] },
  },
  { _id: false }
);
