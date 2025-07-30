import { ethers } from 'ethers';

export async function connectToSepolia() {
  if (typeof window.ethereum === 'undefined') throw new Error("No wallet found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return { provider, signer };
}
