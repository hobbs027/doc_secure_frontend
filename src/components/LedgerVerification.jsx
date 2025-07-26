import React, { useState } from 'react';

function LedgerVerification() {
  const [status, setStatus] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    setVerifying(true);
    setStatus('');

    try {
      const res = await fetch('http://localhost:3000/api/protected/ledger/verify', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(data.valid ? 'Ledger integrity confirmed' : 'Ledger compromised');
      } else {
        setStatus(data.message || 'Verification failed');
      }
    } catch (err) {
      setStatus('Server error');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2"> Ledger Verification</h2>
      <button
        onClick={handleVerify}
        disabled={verifying}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {verifying ? 'Verifying...' : 'Verify Ledger'}
      </button>
      {status && <p className="mt-3 text-sm text-gray-800">{status}</p>}
    </div>
  );
}

export default LedgerVerification;
