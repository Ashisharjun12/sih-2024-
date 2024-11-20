export type UserRole = "user" | "admin" | "researcher" | "startup" | "iprProfessional" | "policyMaker" | "fundingAgency" | "mentor";

export const roleConfig = {
  admin: {
    path: "/admin",
    label: "Admin Panel",
    accessLevel: 100,
  },
  startup: {
    path: "/startup",
    label: "Startup Panel",
    accessLevel: 50,
  },
  researcher: {
    path: "/researcher",
    label: "Researcher Panel",
    accessLevel: 50,
  },
  iprProfessional: {
    path: "/ipr-professional",
    label: "IPR Panel",
    accessLevel: 50,
  },
  policyMaker: {
    path: "/policy-maker",
    label: "Policy Panel",
    accessLevel: 50,
  },
  fundingAgency: {
    path: "/funding-agency",
    label: "Funding Panel",
    accessLevel: 50,
  },
  mentor: {
    path: "/mentor",
    label: "Mentor Panel",
    accessLevel: 50,
  },
  user: {
    path: "/dashboard",
    label: "Dashboard",
    accessLevel: 10,
  },
};

export const hasAccess = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const userAccess = roleConfig[userRole]?.accessLevel || 0;
  const requiredAccess = roleConfig[requiredRole]?.accessLevel || 0;
  return userAccess >= requiredAccess;
};

export const getRoleRoutes = (userRole: UserRole) => {
  const routes = [];
  for (const [role, config] of Object.entries(roleConfig)) {
    if (hasAccess(userRole, role as UserRole)) {
      routes.push({ role, ...config });
    }
  }
  return routes;
}; 