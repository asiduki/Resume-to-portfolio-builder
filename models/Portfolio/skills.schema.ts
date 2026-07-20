import { Schema } from "mongoose";
import { ISkills } from "./portfolio.types";

export const skillsSchema = new Schema<ISkills>(
  {
    languages: { type: [String], default: [] },
    frontend: { type: [String], default: [] },
    backend: { type: [String], default: [] },
    database: { type: [String], default: [] },
    frameworks: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    cloud: { type: [String], default: [] },
    other: { type: [String], default: [] },
  },
  { _id: false }
);
