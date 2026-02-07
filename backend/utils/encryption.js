const CryptoJS = require("crypto-js");

// Encrypt plain text
const encryptText = (text, secret) => {
  return CryptoJS.AES.encrypt(text, secret).toString();
};

// Decrypt encrypted text
const decryptText = (cipherText, secret) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encryptText, decryptText };
