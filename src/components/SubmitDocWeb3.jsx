import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { hashDocument } from '../utils/hashDoc';
import { connectToSepolia } from '../utils/connectSepolia';
import contractABI from '../contract/DocumentVaultABI.json';

const contractAddress = '0xb7f324fc95bbe3374257d9c3eb28655a3a3bd8c3';

export default function SubmitDocWeb3() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState(null);

  const clearForm = () => {
    setTitle('');
    setContent('');
    setExpiresAt('');
  };

  const submitToBlockchain = async () => {
    setIsSubmitting(true);
    toast.loading('Submitting document...');

    try {
      const docHash = hashDocument(title, content);
      const { signer } = await connectToSepolia();
      const contract = new signer.Contract(contractAddress, contractABI, signer);

      const expiryTimestamp = expiresAt ? Math.floor(new Date(expiresAt).getTime() / 1000) : 0;
      const tx = await contract.submitDocument(docHash, expiryTimestamp);
      await tx.wait();

      toast.success('Document submitted successfully!');
      setTxHash(tx.hash);
      clearForm();
    } catch (err) {
      toast.error(`Submission failed`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
      toast.dismiss();
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Blockchain Document Submission</h2>

      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 mb-2 border rounded"
      />

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Content"
        className="w-full p-2 mb-2 border rounded h-24"
      />

      <input
        type="datetime-local"
        value={expiresAt}
        onChange={e => setExpiresAt(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <button
        onClick={submitToBlockchain}
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded ${
          isSubmitting ? 'bg-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Document'}
      </button>

      {txHash && (
        <div className="mt-4 text-sm text-gray-700">
          <p>✅ <strong>Transaction Hash:</strong></p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline break-all"
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
}
