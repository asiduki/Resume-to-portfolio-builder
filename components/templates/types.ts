import {
  IPersonal,
  ISkills,
  IProject,
  IExperience,
  IEducation,
  ICertification,
  ISocial,
} from "@/models/Portfolio/portfolio.types";

export interface PortfolioData {
  username: string;
  personal: IPersonal;
  skills: ISkills;
  projects: IProject[];
  experience: IExperience[];
  education: IEducation[];
  certifications: ICertification[];
  social: ISocial;
}

export interface TemplateProps {
  portfolio: PortfolioData;
}

export const SKILL_GROUPS: { title: string; key: keyof ISkills }[] = [
  { title: "Languages", key: "languages" },
  { title: "Frontend", key: "frontend" },
  { title: "Backend", key: "backend" },
  { title: "Database", key: "database" },
  { title: "Frameworks", key: "frameworks" },
  { title: "Tools", key: "tools" },
  { title: "Cloud", key: "cloud" },
  { title: "Other", key: "other" },
];
