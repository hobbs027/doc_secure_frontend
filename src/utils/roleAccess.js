// utils/roleAccess.js
export const getAllowedLinks = (role) => {
  const map = {
    admin: ['/admin', '/dashboard'],
    reviewer: ['/review-submissions', '/dashboard'],
    uploader: ['/submit', '/dashboard'],
    guest: ['/dashboard'],
  };

  return map[role] || map.guest;
};
