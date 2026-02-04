"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Shield, Key, CheckCircle, AlertTriangle, Loader } from "lucide-react";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_mock");

function ClaimContent() {
    const searchParams = useSearchParams();
    const keyFromUrl = searchParams.get("key");

    const [accessKey, setAccessKey] = useState(keyFromUrl || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        if (keyFromUrl) {
            setAccessKey(keyFromUrl);
        }
    }, [keyFromUrl]);

    const handleVerify = async () => {
        if (!accessKey.trim()) {
            setError("Please enter your access key");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/identify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessKey: accessKey.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to start verification");
            }

            setClientSecret(data.clientSecret);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const startStripeFlow = async () => {
        const stripe = await stripePromise;
        if (!stripe || !clientSecret) return;

        setVerifying(true);

        try {
            const { error } = await stripe.verifyIdentity(clientSecret);
            if (error) {
                console.log("[error]", error);
                setError(error.message || "Verification failed");
            } else {
                // Redirect to vault after successful verification
                window.location.href = `/vault/${accessKey}`;
            }
        } catch (err: any) {
            setError(err.message || "Verification failed");
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Legacy Planning</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Claim your legacy access</p>
                </div>

                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="w-5 h-5 text-indigo-500" />
                            {clientSecret ? "Identity Verification" : "Access Your Legacy"}
                        </CardTitle>
                        <CardDescription>
                            {clientSecret
                                ? "Complete identity verification to access the vault"
                                : "Enter the access key you received via email"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!clientSecret ? (
                            <div className="space-y-5">
                                <Input
                                    label="Access Key"
                                    placeholder="Enter your access key"
                                    value={accessKey}
                                    onChange={(e) => setAccessKey(e.target.value)}
                                    icon={<Key className="w-5 h-5" />}
                                />

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                    </div>
                                )}

                                <Button onClick={handleVerify} loading={loading} className="w-full" size="lg">
                                    Start Verification
                                </Button>

                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-700 dark:text-blue-400">
                                        ℹ️ You will need to verify your identity with a government-issued ID
                                        and a selfie to access the vault.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Access Key Validated!
                                    </h3>
                                    <p className="text-gray-500 mt-2">
                                        Please verify your identity to unlock the vault.
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                    </div>
                                )}

                                <Button
                                    onClick={startStripeFlow}
                                    loading={verifying}
                                    className="w-full bg-[#635BFF] hover:bg-[#534be0]"
                                    size="lg"
                                >
                                    Verify Identity with Stripe
                                </Button>

                                <button
                                    onClick={() => setClientSecret("")}
                                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Use a different access key
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Your identity verification is processed securely by Stripe
                </p>
            </div>
        </div>
    );
}

export default function ClaimPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        }>
            <ClaimContent />
        </Suspense>
    );
}
