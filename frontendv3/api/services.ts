import { buildPublicApiUrl } from './apiConfig';
import { ExperienceDTO, Experience, ProjectDTO, Project, CvDownloadResponse, ProjectObject } from '../types';

// --- Adapters / Transformers ---

// Transform API Experience to UI Experience
function adaptExperience(dto: ExperienceDTO): Experience {
  const isCurrent = !dto.endYear;
  
  // Create bullet points from description string (splitting by newlines or periods if simple string)
  const descriptionPoints = dto.description 
    ? dto.description.split(/(?:\r\n|\r|\n)/g).filter(line => line.trim().length > 0)
    : ["No details provided."];

  return {
    id: dto.id || `i-${Math.random().toString(36).substr(2, 9)}`,
    role: dto.role,
    company: dto.company,
    type: dto.focus ? `${dto.focus.toLowerCase().replace(/\s+/g, '.')}.large` : 'general.t3.medium',
    state: (dto.state?.toLowerCase() as any) || (isCurrent ? 'running' : 'stopped'),
    az: 'eu-west-1a', // Default region metaphor
    launchTime: `${dto.startYear || 'Unknown'} - ${dto.endYear || 'Present'}`,
    description: descriptionPoints,
    tags: {
      'Name': `${dto.company} - ${dto.role}`,
      'Focus': dto.focus || 'General Engineering',
      'Role': dto.role,
      'CostCenter': dto.company
    }
  };
}

// Transform API Project to UI Project (S3 Bucket)
function adaptProject(dto: ProjectDTO): Project {
  // Generate some fake objects so the UI isn't empty
  const mockObjects: ProjectObject[] = [
    { name: 'README.md', type: 'md', lastModified: '2024-01-01', size: '2 KB', storageClass: 'Standard' },
    { name: 'src/', type: 'folder', lastModified: '-', size: '-', storageClass: '-' },
    { name: 'config.json', type: 'json', lastModified: '2024-01-02', size: '450 B', storageClass: 'Standard' }
  ];

  const techStack = dto.technologies?.join(', ') || 'General';

  return {
    bucketName: dto.name.toLowerCase().replace(/\s+/g, '-'),
    region: dto.region || 'eu-west-1',
    access: dto.organization ? 'Private' : 'Public',
    lastModified: `${dto.createdYear || '2024'}-Present`,
    size: 'Standard',
    description: dto.description || 'No description provided.',
    arn: `arn:jan:s3:::${dto.name.toLowerCase().replace(/\s+/g, '-')}`,
    creationDate: new Date(dto.createdYear ? `${dto.createdYear}-01-01` : Date.now()).toUTCString(),
    objects: mockObjects,
    tags: {
      'Service': dto.serviceType || 'S3',
      'Lifecycle': dto.lifecycle,
      'Organization': dto.organization || 'Personal',
      'Stack': techStack
    }
  };
}

// --- Fetch Functions ---

export async function fetchCvDownloadUrl(): Promise<string> {
  const res = await fetch(buildPublicApiUrl('/cv/download'));
  if (!res.ok) {
    throw new Error('Failed to fetch CV download URL');
  }
  const data = (await res.json()) as CvDownloadResponse;
  return data.url;
}

export async function fetchExperiences(): Promise<Experience[]> {
  const res = await fetch(buildPublicApiUrl('/experiences'));
  if (!res.ok) {
    throw new Error('Failed to fetch experiences');
  }
  const data = (await res.json()) as ExperienceDTO[];
  return data.map(adaptExperience);
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(buildPublicApiUrl('/projects'));
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }
  const data = (await res.json()) as ProjectDTO[];
  return data.map(adaptProject);
}