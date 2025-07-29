import { useState } from 'react';
import axios from '../utils/axiosAuth';
import { toast } from 'react-toastify';

const SubmitDoc = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post('/docs/submit', { title, content });
      toast.success('✅ Document submitted');
    } catch (err) {
      toast.error('🚫 Submission failed: Unauthorized access');
    }
  };

  return (
    <div>
      <h2>📝 Submit Document</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default SubmitDoc;
