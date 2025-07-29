// src/hooks/useEthereum.js
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import DocumentVerifierABI from "../contracts/DocumentVerifierABI.json";
import { contractAddress } from "../contracts/contractInfo";

export function useEthereum() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return;
      try {
        const tempProvider = new ethers.providers.BrowserProvider(window.ethereum);
        await tempProvider.send("eth_requestAccounts", []);
        const tempSigner = tempProvider.getSigner();
        const tempContract = new ethers.Contract(contractAddress, DocumentVerifierABI, tempSigner);

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
      } catch (err) {
        console.error("Ethereum init error:", err);
      }
    };
    init();
  }, []);

  return { provider, signer, contract };
}
