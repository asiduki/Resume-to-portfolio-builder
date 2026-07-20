import mongoose, { Model, Schema } from "mongoose";
import { IPortfolio } from "./Portfolio/portfolio.types";
import { personalSchema } from "./Portfolio/personal.schema";
import { skillsSchema } from "./Portfolio/skills.schema";
import { projectSchema } from "./Portfolio/projects.schema";
import { experienceSchema } from "./Portfolio/experience.schema";
import { educationSchema } from "./Portfolio/education.schema";
import { certificationSchema } from "./Portfolio/certification.schema";
import { socialSchema } from "./Portfolio/social.schema";
import { seoSchema } from "./Portfolio/seo.schema";

const portfolioSchema = new Schema<IPortfolio>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    template: {
      type: String,
      default: "modern",
    },

    published: {
      type: Boolean,
      default: false,
    },

    personal: { type: personalSchema, default: () => ({}) },
    skills: { type: skillsSchema, default: () => ({}) },
    projects: { type: [projectSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    social: { type: socialSchema, default: () => ({}) },
    seo: { type: seoSchema, default: () => ({}) },
  },
  {
    timestamps: true,
  }
);

const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio ||
  mongoose.model<IPortfolio>("Portfolio", portfolioSchema);

export default Portfolio;
