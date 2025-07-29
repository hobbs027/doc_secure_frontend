import { useEffect, useState } from 'react';
import axios from '../utils/axiosAuth';
import { toast } from 'react-toastify';

const ReviewDocs = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    axios.get('/docs/review-submissions')
      .then((res) => setDocs(res.data.documents))
      .catch((err) => {
        toast.error('Access denied: You do not have reviewer permissions');
      });
  }, []);

  return (
    <div>
      <h2>📄 Submitted Documents</h2>
      {docs.map((doc) => (
        <div key={doc.id}>
          <strong>{doc.title}</strong> by {doc.submittedBy}
        </div>
      ))}
    </div>
  );
};

export default ReviewDocs;
