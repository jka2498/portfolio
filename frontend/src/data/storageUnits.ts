export type StorageUnit = {
  id: string;
  name: string;
  type: string;
  scope: "Small" | "Medium" | "Large";
  lifecycleState: "Active" | "Archived";
  accessLevel: "Public" | "Private";
  lastUpdated: string;
};

export const STORAGE_UNITS: StorageUnit[] = [
  {
    id: "storage-001",
    name: "Observability Portal",
    type: "Application",
    scope: "Large",
    lifecycleState: "Active",
    accessLevel: "Private",
    lastUpdated: "2024-06-12",
  },
  {
    id: "storage-002",
    name: "Design System",
    type: "Library",
    scope: "Medium",
    lifecycleState: "Active",
    accessLevel: "Public",
    lastUpdated: "2024-05-30",
  },
  {
    id: "storage-003",
    name: "Deployment Pipeline",
    type: "Infrastructure",
    scope: "Medium",
    lifecycleState: "Archived",
    accessLevel: "Private",
    lastUpdated: "2023-11-18",
  },
];
