import { Schema } from "mongoose";
import { IPersonal } from "./portfolio.types";

export const personalSchema = new Schema<IPersonal>(
  {
    name: { type: String, default: "" },
    title: { type: String, default: "" },
    tagline: { type: String, default: "" },
    about: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    profileImage: { type: String, default: "" },
  },
  { _id: false }
);
