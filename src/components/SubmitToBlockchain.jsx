import React, { useState } from "react";
import { useEthereum } from "../hooks/useEthereum";
import { hashDocument } from "../utils/hashDoc";
import { toast } from "react-hot-toast";

const SubmitToBlockchain = ({ documentContent, docId, onVerified }) => {
  const { contract } = useEthereum();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!documentContent || documentContent.trim().length < 10) {
      toast.error("Document content is too short or missing.");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Submitting document to Ethereum...");

      const hash = hashDocument("Untitled",documentContent);

      let tx;
      if (process.env.NODE_ENV === "development" || !contract) {
        // Demo mode fallback
        console.log("Demo mode: simulating blockchain submission...");
        await new Promise((res) => setTimeout(res, 1500));
        tx = { wait: () => Promise.resolve() };
      } else {
        tx = await contract.recordDocumentHash(hash);
      }

      await tx.wait();
      toast.dismiss();
      toast.success("Document hash successfully submitted! 🟢");

      // 🔄 Notify parent to update status
      if (onVerified) {
        onVerified(docId);
      }
    } catch (err) {
      toast.dismiss();
      toast.error(`Submission failed: ${err.message.slice(0, 100)}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Submitting..." : "Submit to Blockchain"}
    </button>
  );
};

export default SubmitToBlockchain;
