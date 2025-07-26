import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SidebarLayout from './SidebarLayout';
import FileManager from './FileManager';
import FileUpload from './FileUpload';
import UserBadge from './UserBadge';
import RecentUploads from './RecentUploads';
import UploadStatsChart from './UploadStatsChart';
import ImageGallery from './ImageGallery';
import AuditLogPanel from './AuditLogPanel';
import AuditAlertPanel from './AuditAlertPanel';
import LedgerViewer from './LedgerViewer';
import LedgerVerification from './LedgerVerification';
import FileSummaryPanel from './FileSummaryPanel';

function Dashboard({ onLogout }) {
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    onLogout && onLogout();
    navigate('/login');
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) setUserRole(role);
  }, []);

  return (
    <SidebarLayout onLogout={handleLogout}>
      {(activePanel) => {
        switch (activePanel) {
          case 'files':
            return (
              <>
                <UserBadge />
                <RecentUploads />
                <FileSummaryPanel />
                <FileUpload />
                <FileManager userRole={userRole} />
                <UploadStatsChart />
                <UploadTimelineChart />
                <ImageGallery />
              </>
            );
          case 'alerts':
            return <AuditAlertPanel />;
          case 'logs':
            return <AuditLogPanel />;
          case 'visuals':
            return (
              <>
                <AuditAlertPanel />
                <UploadStatsChart />
                <UploadTimelineChart />
              </>
            );
          case 'ledger':
            return (
              <>
                <LedgerViewer />
                <LedgerVerification />
              </>
            );
          default:
            return <FileManager userRole={userRole} />;
        }
      }}
    </SidebarLayout>
  );
}

export default Dashboard;
