import { useContract, useProvider, useSigner, useAccount } from 'wagmi';
import { contractAddress } from '../contracts/contractInfo';
import vaultABI from '../contracts/DocumentVaultABI.json';

export const useDocumentVault = () => {
  const { address } = useAccount();
  const provider = useProvider();
  const signer = useSigner();

  const contract = useContract({
    address: contractAddress,
    abi: vaultABI,
    signerOrProvider: signer.data || provider,
  });

  return {
    submitDocument: async (docId, hash, expiresAt) => {
      console.log(`Submitting document from: ${address}`);
      const tx = await contract.submitDocument(docId, hash, expiresAt);
      await tx.wait();
      return tx;
    },
    getDocument: async (docId) => {
      return await contract.getDocument(docId);
    },
    revokeDocument: async (docId) => {
      const tx = await contract.revokeDocument(docId);
      await tx.wait();
      return tx;
    },
    verifyDocument: async (docId, hashToCheck) => {
      return await contract.verifyDocument(docId, hashToCheck);
    },
    listDocumentIds: async () => {
      return await contract.listDocumentIds();
    },
    signerOrProvider: signer.data ?? provider,
  };
};
