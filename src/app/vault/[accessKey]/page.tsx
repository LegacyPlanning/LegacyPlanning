"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    Shield,
    Lock,
    Unlock,
    FileText,
    Key,
    AlertTriangle,
    CheckCircle,
    Loader,
} from "lucide-react";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import BeneficiaryGuide from "@/components/BeneficiaryGuide";

interface VaultData {
    beneficiary: {
        name: string;
        verificationStatus: string;
        accessGrantedAt: string | null;
    };
    owner: {
        name: string;
    };
    assets: Array<{
        id: string;
        name: string;
        type: string;
        platform: string | null;
        encryptedData: string;
    }>;
}

export default function VaultPage() {
    const params = useParams();
    const accessKey = params.accessKey as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [vaultData, setVaultData] = useState<VaultData | null>(null);

    const [decryptionKey, setDecryptionKey] = useState("");
    const [decryptedData, setDecryptedData] = useState<Record<string, string>>({});
    const [decrypting, setDecrypting] = useState<string | null>(null);

    useEffect(() => {
        fetchVaultData();
    }, [accessKey]);

    const fetchVaultData = async () => {
        try {
            const res = await fetch(`/api/vault/${accessKey}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to access vault");
            }

            setVaultData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDecrypt = async (assetId: string, encryptedData: string) => {
        if (!decryptionKey) {
            alert("Please enter the decryption key first");
            return;
        }

        setDecrypting(assetId);
        try {
            const { importKey, decryptData } = await import("@/lib/encryption");
            const key = await importKey(decryptionKey);
            const parsed = JSON.parse(encryptedData);
            const decrypted = await decryptData(parsed.ciphertext, parsed.iv, key);

            setDecryptedData((prev) => ({
                ...prev,
                [assetId]: typeof decrypted.content === "string" ? decrypted.content : JSON.stringify(decrypted),
            }));
        } catch (err) {
            alert("Decryption failed. Please check your key.");
        } finally {
            setDecrypting(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
                <div className="text-center">
                    <Loader className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Accessing vault...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
                <Card variant="glass" className="max-w-md w-full text-center">
                    <CardContent className="py-12">
                        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Access Denied
                        </h2>
                        <p className="text-gray-500">{error}</p>
                        <Button variant="outline" className="mt-6" onClick={() => window.history.back()}>
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (vaultData?.beneficiary.verificationStatus !== "VERIFIED") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
                <Card variant="glass" className="max-w-md w-full text-center">
                    <CardContent className="py-12">
                        <Lock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Verification Required
                        </h2>
                        <p className="text-gray-500 mb-4">
                            You need to complete identity verification before accessing this vault.
                        </p>
                        <Badge variant="warning">Status: {vaultData?.beneficiary.verificationStatus}</Badge>
                        <Button className="mt-6 w-full" onClick={() => window.location.href = `/claim?key=${accessKey}`}>
                            Complete Verification
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
            <div className="max-w-4xl mx-auto p-6 lg:p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 mb-4">
                        <Unlock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Legacy Vault</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Accessing assets from <strong>{vaultData?.owner.name}</strong>
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 dark:text-green-400">
                            Verified as {vaultData?.beneficiary.name}
                        </span>
                    </div>
                </div>

                {/* Decryption Key Input */}
                <Card variant="glass" className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="w-5 h-5 text-indigo-500" />
                            Decryption Key
                        </CardTitle>
                        <CardDescription>
                            Enter the encryption key provided by the vault owner to decrypt assets
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder='Paste the encryption key here (JSON format starting with {"kty":"oct"...})'
                            value={decryptionKey}
                            onChange={(e) => setDecryptionKey(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Assets List */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Encrypted Assets ({vaultData?.assets.length})
                    </h2>

                    {vaultData?.assets.map((asset) => (
                        <Card key={asset.id} variant="default">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-indigo-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {asset.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="info" size="sm">{asset.type}</Badge>
                                                {asset.platform && (
                                                    <span className="text-sm text-gray-500">{asset.platform}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant={decryptedData[asset.id] ? "secondary" : "primary"}
                                        size="sm"
                                        onClick={() => handleDecrypt(asset.id, asset.encryptedData)}
                                        loading={decrypting === asset.id}
                                        disabled={!!decryptedData[asset.id]}
                                    >
                                        {decryptedData[asset.id] ? (
                                            <>
                                                <Unlock className="w-4 h-4 mr-1" />
                                                Decrypted
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-4 h-4 mr-1" />
                                                Decrypt
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {decryptedData[asset.id] && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Decrypted Content:
                                        </p>
                                        <pre className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-mono whitespace-pre-wrap break-words text-gray-900 dark:text-white">
                                            {decryptedData[asset.id]}
                                        </pre>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {vaultData?.assets.length === 0 && (
                        <Card variant="bordered" className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No assets in this vault</p>
                        </Card>
                    )}
                </div>

                {/* AI Guide */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        AI Assistant
                    </h2>
                    <BeneficiaryGuide />
                </div>
            </div>
        </div>
    );
}
