import ModernTemplate from "./ModernTemplate";
import DeveloperTemplate from "./DeveloperTemplate";
import MinimalTemplate from "./MinimalTemplate";
import CreativeTemplate from "./CreativeTemplate";

import { TemplateProps } from "./types";

const templates: Record<string, React.ComponentType<TemplateProps>> = {
  modern: ModernTemplate,
  developer: DeveloperTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
};

export function getTemplate(name: string) {
  return templates[name] ?? ModernTemplate;
}

export type { TemplateProps, PortfolioData } from "./types";
