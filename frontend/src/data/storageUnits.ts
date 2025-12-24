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
    name: "Platform Runbooks",
    type: "Operational Docs",
    scope: "Medium",
    lifecycleState: "Active",
    accessLevel: "Private",
    lastUpdated: "2024-09-12",
  },
  {
    id: "storage-002",
    name: "Cloud Cost Dashboards",
    type: "Analytics",
    scope: "Large",
    lifecycleState: "Active",
    accessLevel: "Private",
    lastUpdated: "2024-08-25",
  },
  {
    id: "storage-003",
    name: "Legacy Migration Artifacts",
    type: "Infrastructure",
    scope: "Small",
    lifecycleState: "Archived",
    accessLevel: "Private",
    lastUpdated: "2023-12-18",
  },
];
