import { useEffect, useState } from "react";
import { ethers } from "ethers";
import DocumentVerifierABI from "../contracts/DocumentVerifierABI.json";
import { contractAddress } from "../contracts/contractInfo.js";

export function useEthereum() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return;
      try {
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        await ethProvider.send("eth_requestAccounts", []);
        const ethSigner = ethProvider.getSigner();
        const ethContract = new ethers.Contract(contractAddress, DocumentVerifierABI, ethSigner);

        setProvider(ethProvider);
        setSigner(ethSigner);
        setContract(ethContract);
      } catch (err) {
        console.error("Ethereum init error:", err);
      }
    };
    init();
  }, []);

  return { provider, signer, contract };
}
