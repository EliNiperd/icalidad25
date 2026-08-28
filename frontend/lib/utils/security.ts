import CryptoJS from 'crypto-js';

// Clave secreta - DEBE estar en variables de entorno
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'tu-clave-secreta-muy-larga-y-compleja-2024';

// Encriptar en el cliente
export function encryptPassword(password: string): string {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
}

// Desencriptar en el servidor
export function decryptPassword(encryptedPassword: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}