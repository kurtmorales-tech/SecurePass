
// A service to handle all Web Crypto API interactions for vault encryption.

const PBKDF2_ITERATIONS = 310000; // Increased iterations for stronger security
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

/**
 * Derives a cryptographic key from a master password and a salt.
 * @param password The user's master password.
 * @param salt The salt to use for key derivation.
 * @returns A CryptoKey suitable for AES-GCM encryption.
 */
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const masterKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    masterKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a string of data using a derived key.
 * @param data The plaintext data to encrypt (e.g., JSON string of credentials).
 * @param key The CryptoKey to use for encryption.
 * @returns A promise that resolves to an object containing the initialization vector (iv) and the encrypted data.
 */
export async function encrypt(data: string, key: CryptoKey): Promise<{ iv: Uint8Array; encryptedData: ArrayBuffer }> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encodedData = new TextEncoder().encode(data);

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encodedData
  );

  return { iv, encryptedData };
}

/**
 * Decrypts data using a derived key and an initialization vector.
 * @param encryptedData The ArrayBuffer of the encrypted data.
 * @param key The CryptoKey to use for decryption.
 * @param iv The initialization vector used during encryption.
 * @returns A promise that resolves to the decrypted plaintext data as a string.
 */
export async function decrypt(encryptedData: ArrayBuffer, key: CryptoKey, iv: Uint8Array): Promise<string> {
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encryptedData
  );

  return new TextDecoder().decode(decryptedData);
}

/**
 * Generates a new random salt.
 */
export function generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

// Helper functions to convert between ArrayBuffer and Base64 for storing in localStorage
export function bufferToBase64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function base64ToBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}