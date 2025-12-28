// --- API Data Transfer Objects (DTOs) ---
export interface ExperienceDTO {
  id: string;
  role: string;
  company: string;
  state?: string;
  startYear?: number;
  endYear?: number; // Added optional end year
  description?: string;
  instanceType?: string;
  az?: string;
  technologies?: string[];
  responsibilities?: string[];
}

export type ProjectLifecycle = 'ACTIVE' | 'ARCHIVED';
export type ProjectAccess = 'PUBLIC' | 'PRIVATE';
export type ProjectServiceType = 'S3' | 'DynamoDB' | 'Lambda' | (string & {});

export interface ProjectDTO {
  id: string;
  name: string;
  serviceType?: ProjectServiceType;
  description?: string;
  organization?: string;
  region?: string;
  access?: ProjectAccess;
  lifecycle: ProjectLifecycle;
  createdYear?: number;
  technologies?: string[];
  githubUrl?: string;
}

export type CvDownloadResponse = {
  url: string;
}

// --- UI Models (Rich Data for Views) ---

export interface Experience {
  id: string;
  role: string;
  company: string;
  type: string; 
  state: 'running' | 'stopped' | 'terminated';
  az: string; 
  launchTime: string; 
  description: string[]; // UI expects array for bullet points
  tags: Record<string, string>; 
}

export interface ProjectObject {
  name: string;
  type: string; 
  lastModified: string;
  size: string;
  storageClass: string;
}

export interface Project {
  bucketName: string;
  region: string; 
  access: 'Public' | 'Private';
  lastModified: string;
  size: string; 
  description: string; 
  arn: string;
  creationDate: string;
  objects: ProjectObject[];
  tags: Record<string, string>;
  githubUrl?: string;
}

export interface SkillPoint {
  name: string;
  usage: number; 
  forecast: number; 
}

export interface ServiceLink {
  id: string;
  name: string;
  icon: string;
  description: string;
}
