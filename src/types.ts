export * from './types/index';

export interface ProjectPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultModel: string;
  pattern: string;
  vectorDb: string;
  capabilities: string[];
}
