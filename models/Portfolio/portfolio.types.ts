import mongoose, { Document } from "mongoose";

export interface IPersonal {
  name: string;
  title: string;
  tagline: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  profileImage: string;
}

export interface ISkills {
  languages: string[];
  frontend: string[];
  backend: string[];
  database: string[];
  frameworks: string[];
  tools: string[];
  cloud: string[];
  other: string[];
}

export interface IProject {
  title: string;
  description: string;
  technologies: string[];
  github: string;
  liveDemo: string;
  image: string;
  highlights: string[];
}

export interface IExperience {
  company: string;
  position: string;
  employmentType: string;
  location: string;
  duration: string;
  description: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  duration: string;
  grade: string;
}

export interface ICertification {
  name: string;
  issuer: string;
  year: string;
  credentialUrl: string;
}

export interface ISocial {
  github: string;
  linkedin: string;
  twitter: string;
  leetcode: string;
  codeforces: string;
  codechef: string;
  hackerrank: string;
}

export interface ISEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  template: string;
  published: boolean;

  personal: IPersonal;
  skills: ISkills;

  projects: IProject[];
  experience: IExperience[];
  education: IEducation[];
  certifications: ICertification[];

  social: ISocial;
  seo: ISEO;

  createdAt: Date;
  updatedAt: Date;
}
