
export const getAllowedPanels = (role) => {
  const panels = {
    admin: ['files', 'alerts', 'logs', 'ledger', 'visuals'],
    reviewer: ['alerts', 'logs'],
    uploader: ['files', 'visuals'],
    guest: ['files'],
  };

  return panels[role] || panels.guest;
};
