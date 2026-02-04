export async function generateKey(): Promise<CryptoKey> {
    return window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

export async function exportKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey("jwk", key);
    return JSON.stringify(exported);
}

export async function importKey(jwkString: string): Promise<CryptoKey> {
    const jwk = JSON.parse(jwkString);
    return window.crypto.subtle.importKey(
        "jwk",
        jwk,
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

export async function encryptData(data: any, key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encodedData
    );

    return {
        ciphertext: arrayBufferToBase64(encrypted),
        iv: arrayBufferToBase64(iv),
    };
}

export async function decryptData(ciphertext: string, iv: string, key: CryptoKey): Promise<any> {
    const encryptedData = base64ToArrayBuffer(ciphertext);
    const ivBuffer = base64ToArrayBuffer(iv);

    const decrypted = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: ivBuffer,
        },
        key,
        encryptedData
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
}

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
