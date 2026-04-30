import { ROLES } from "../constants/roles";

export const hasRole = (user, role) => {
  if (!user || !Array.isArray(user.roles)) {
    return false;
  }

  return user.roles.includes(role);
};

export const canViewAuthorDashboard = (user) => hasRole(user, ROLES.AUTHOR);
export const canSubmitPaper = (user) => hasRole(user, ROLES.AUTHOR);
export const canReviewPaper = (user) => hasRole(user, ROLES.REVIEWER);
export const canChairConference = (user) => hasRole(user, ROLES.CHAIR);
export const canManagePlatform = (user) => hasRole(user, ROLES.ADMIN);

export const canEditProfile = (user) => !!user;
