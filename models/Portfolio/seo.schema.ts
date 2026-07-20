import { Schema } from "mongoose";
import { ISEO } from "./portfolio.types";

export const seoSchema = new Schema<ISEO>(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    keywords: { type: [String], default: [] },
  },
  { _id: false }
);
