"use client";

import { useState } from "react";
import { generateKey, encryptData, exportKey } from "@/lib/encryption";

export default function EncryptionDemo() {
    const [data, setData] = useState("");
    const [status, setStatus] = useState("");
    const [encryptedOutput, setEncryptedOutput] = useState("");

    const handleSave = async () => {
        setStatus("Generating Key...");
        try {
            // 1. Generate Key (Client Side)
            const key = await generateKey();

            // 2. Encrypt Data (Client Side)
            setStatus("Encrypting...");
            const { ciphertext, iv } = await encryptData({ content: data }, key);

            // Store IV with ciphertext for simplicity in this demo, usually stored separately or prepended
            const payload = JSON.stringify({ ciphertext, iv });
            setEncryptedOutput(payload);

            // 3. Send ONLY Ciphertext to Server
            setStatus("Sending to Server...");
            const response = await fetch("/api/assets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    encryptedData: payload,
                    type: "text_note",
                }),
            });

            if (response.ok) {
                setStatus("Success! Data saved securely.");
            } else {
                setStatus("Failed to save data.");
            }

            // Optional: Export key for user to save (Never send this to server!)
            const exportedKey = await exportKey(key);
            console.log("Secret Key (Keep Safe!):", exportedKey);

        } catch (e) {
            console.error(e);
            setStatus("Error occurred.");
        }
    };

    return (
        <div className="p-4 border rounded shadow-sm bg-white dark:bg-zinc-800 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Secure Vault</h2>
            <textarea
                className="w-full p-2 border rounded mb-4 text-black"
                placeholder="Enter sensitive data..."
                value={data}
                onChange={(e) => setData(e.target.value)}
            />
            <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Encrypt & Save
            </button>

            {status && <p className="mt-4 text-sm font-mono">{status}</p>}

            {encryptedOutput && (
                <div className="mt-4">
                    <p className="text-xs font-bold">What the server sees:</p>
                    <pre className="text-xs bg-gray-100 dark:bg-zinc-900 p-2 overflow-x-auto">
                        {encryptedOutput}
                    </pre>
                </div>
            )}
        </div>
    );
}
