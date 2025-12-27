import { SkillPoint, ServiceLink } from './types';
import { Server, HardDrive, Shield, Activity, Database, Globe } from 'lucide-react';

// Static Data for Visuals (Charts, Icons) that don't need API yet

export const SKILL_DATA: SkillPoint[] = [
  { name: 'Java', usage: 95, forecast: 98 },
  { name: 'AWS', usage: 90, forecast: 95 },
  { name: 'Spring Boot', usage: 85, forecast: 90 },
  { name: 'Terraform', usage: 80, forecast: 85 },
  { name: 'Python', usage: 75, forecast: 80 },
  { name: 'React', usage: 60, forecast: 75 },
];

export const RECENT_SERVICES: ServiceLink[] = [
  { id: 'instance', name: 'Instances (Experience)', icon: 'Server', description: 'Career Experience' },
  { id: 'bucket', name: 'Buckets (Projects)', icon: 'HardDrive', description: 'Notible Projects' },
  { id: 'iam', name: 'IAM (About)', icon: 'Shield', description: 'About me' },
  { id: 'cost', name: 'Cost Explorer (Skills)', icon: 'Activity', description: 'Analyze usage and costs' },
  { id: 'db', name: 'Relational Database (Education)', icon: 'Database', description: 'School and University' },
  { id: 'dns', name: 'DNS (Contact)', icon: 'Globe', description: 'Contact Information' },
];