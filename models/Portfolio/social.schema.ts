import { Schema } from "mongoose";
import { ISocial } from "./portfolio.types";

export const socialSchema = new Schema<ISocial>(
  {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    leetcode: { type: String, default: "" },
    codeforces: { type: String, default: "" },
    codechef: { type: String, default: "" },
    hackerrank: { type: String, default: "" },
  },
  { _id: false }
);
