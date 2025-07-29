import CryptoJS from "crypto-js";
import { keccak256 } from "ethers/lib/utils";

// Hash with SHA256 and keccak256
export function getSha256Hash(content) {
  return CryptoJS.SHA256(content).toString(CryptoJS.enc.Hex);
}

export function getKeccakHash(content) {
  return keccak256(Buffer.from(content));
}
