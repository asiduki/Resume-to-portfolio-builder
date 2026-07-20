import { Schema } from "mongoose";
import { ICertification } from "./portfolio.types";

export const certificationSchema = new Schema<ICertification>(
  {
    name: { type: String, default: "" },
    issuer: { type: String, default: "" },
    year: { type: String, default: "" },
    credentialUrl: { type: String, default: "" },
  },
  { _id: false }
);
