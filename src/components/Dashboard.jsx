import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import useAutoLogout from '../hooks/useAutoLogout';

import SidebarLayout from './SidebarLayout';
import FileManager from './FileManager';
import FileUpload from './FileUpload';
import UserBadge from './UserBadge';
import RecentUploads from './RecentUploads';
import UploadStatsChart from './UploadStatsChart';
import UploadTimelineChart from './UploadTimelineChart';
import ImageGallery from './ImageGallery';
import AuditLogPanel from './AuditLogPanel';
import AuditAlertPanel from './AuditAlertPanel';
import LedgerViewer from './LedgerViewer';
import LedgerVerification from './LedgerVerification';
import FileSummaryPanel from './FileSummaryPanel';
import ProfileCard from './ProfileCard';

import SubmitToBlockchain from '../components/SubmitToBlockchain';
import StatusBadge from '../components/StatusBadge';

function Dashboard({ onLogout }) {
  const { user, token } = useAuthContext();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('all');

  const [documents, setDocuments] = useState([
    {
      id: 'doc1',
      title: 'Onboarding_Kit.pdf',
      content: 'Welcome document for new employees...',
      status: 'unverified',
      verifiedAt: null
    },
    {
      id: 'doc2',
      title: 'Budget_Q3.xlsx',
      content: 'Financial breakdown for Q3 projections...',
      status: 'unverified',
      verifiedAt: null
    }
  ]);

  const updateStatus = (docId, newStatus) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              status: newStatus,
              verifiedAt: newStatus === 'verified' ? new Date().toISOString() : doc.verifiedAt
            }
          : doc
      )
    );
  };

  useAutoLogout(token, () => {
    localStorage.clear();
    if (onLogout) onLogout();
    navigate('/login');
  });

  const handleLogout = () => {
    localStorage.clear();
    if (onLogout) onLogout();
    navigate('/login');
  };

  const filteredDocuments =
    statusFilter === 'all'
      ? documents
      : documents.filter((doc) => doc.status === statusFilter);

  return (
    <SidebarLayout onLogout={handleLogout} username={user.username} role={user.role}>
      {(activePanel) => {
        switch (activePanel) {
          case 'files':
            return (
              <>
                <ProfileCard token={token} />
                <UserBadge username={user.username} role={user.role} />
                <RecentUploads />
                <FileSummaryPanel />
                <FileUpload />
                <FileManager userRole={user.role} />
                <UploadStatsChart />
                <UploadTimelineChart />
                <ImageGallery />

                {/* 🔗 Blockchain Verification Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Document Verification</h3>

                  {/* 🔍 Status Filter Bar */}
                  <div className="flex gap-2 mb-6">
                    {['all', 'unverified', 'pending', 'verified'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1 rounded text-sm ${
                          statusFilter === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>

                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 border rounded shadow-sm mb-4 bg-white"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-medium">{doc.title}</h4>
                        <StatusBadge status={doc.status} />
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {doc.content.slice(0, 100)}...
                      </p>

                      {doc.status === 'verified' && doc.verifiedAt && (
                        <p className="text-xs text-gray-500 mb-2">
                          Verified on {new Date(doc.verifiedAt).toLocaleString()}
                        </p>
                      )}

                      <SubmitToBlockchain
                        documentContent={doc.content}
                        docId={doc.id}
                        onStatusChange={(status) => updateStatus(doc.id, status)}
                      />
                    </div>
                  ))}
                </div>
              </>
            );
          case 'alerts':
            return user.role === 'admin' ? <AuditAlertPanel /> : <p>Access denied</p>;
          case 'logs':
            return user.role === 'admin' ? <AuditLogPanel /> : <p>Access denied</p>;
          case 'visuals':
            return (
              <>
                {user.role === 'admin' && <AuditAlertPanel />}
                <UploadStatsChart />
                <UploadTimelineChart />
              </>
            );
          case 'ledger':
            return user.role === 'admin' ? (
              <>
                <LedgerViewer />
                <LedgerVerification />
              </>
            ) : (
              <p>Access denied</p>
            );
          default:
            return <FileManager userRole={user.role} />;
        }
      }}
    </SidebarLayout>
  );
}

export default Dashboard;
