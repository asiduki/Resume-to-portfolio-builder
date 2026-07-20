import {
  IPersonal,
  ISkills,
  IProject,
  IExperience,
  IEducation,
  ICertification,
  ISocial,
  ISEO,
} from "@/models/Portfolio/portfolio.types";

/**
 * Plain-JSON portfolio shape as returned by /api/portfolio.
 * (Client-side we never see the Mongoose Document methods.)
 */
export interface EditablePortfolio {
  _id: string;
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
}

/** Field-level validation errors, keyed by "section.field" or "section.index.field". */
export type ValidationErrors = Record<string, string>;

export interface SectionFormProps<T> {
  value: T;
  onChange: (value: T) => void;
  errors: ValidationErrors;
}
