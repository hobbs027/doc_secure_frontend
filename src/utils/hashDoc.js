import CryptoJS from 'crypto-js';
import { keccak256, toUtf8Bytes } from 'ethers';

export const hashDocument = (title, content) => {
  const raw = `${title}:${content}`;
  return keccak256(toUtf8Bytes(raw));
};
