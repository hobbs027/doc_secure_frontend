import CryptoJS from 'crypto-js';

export const hashDocument = (title, content) => {
  const raw = `${title}:${content}`;
  return CryptoJS.SHA256(raw).toString(CryptoJS.enc.Hex);
};
