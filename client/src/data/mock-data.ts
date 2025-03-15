// Dashboard statistics
export const dashboardStats = {
  activeProjects: 12,
  activeCampaigns: 4,
  integrations: 7,
  apiCalls: 124305
};

// Recent projects
export const recentProjects = [
  {
    id: "proj-1",
    name: "Marketing Campaign Q3",
    lastUpdated: "2 days ago",
    status: "active" as const
  },
  {
    id: "proj-2",
    name: "Website Redesign",
    lastUpdated: "1 week ago",
    status: "in-progress" as const
  },
  {
    id: "proj-3",
    name: "Product Launch - Mobile App",
    lastUpdated: "3 days ago",
    status: "active" as const
  },
  {
    id: "proj-4",
    name: "Social Media Strategy",
    lastUpdated: "5 days ago",
    status: "planning" as const
  }
];

// Connected integrations
export const connectedIntegrations = [
  {
    id: "int-1",
    name: "Airtable",
    lastIntegrated: "3 days ago",
    status: "connected" as const,
    icon: "airtable" as const
  },
  {
    id: "int-2",
    name: "Zendesk",
    lastIntegrated: "1 week ago",
    status: "connected" as const,
    icon: "zendesk" as const
  },
  {
    id: "int-3",
    name: "Intercom",
    lastIntegrated: "2 days ago",
    status: "connected" as const,
    icon: "intercom" as const
  },
  {
    id: "int-4",
    name: "Segment",
    lastIntegrated: "5 days ago",
    status: "connected" as const,
    icon: "segment" as const
  }
];
