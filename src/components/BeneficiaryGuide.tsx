"use client";

import { useState } from "react";
import { Sparkles, Loader, FileText } from "lucide-react";
import { generateLegacyGuide } from "@/app/actions/groq";
import Button from "@/components/ui/Button";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function BeneficiaryGuide() {
    const [inputContent, setInputContent] = useState("");
    const [guide, setGuide] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!inputContent) return;
        setLoading(true);
        try {
            const result = await generateLegacyGuide(inputContent);
            setGuide(result);
        } catch (error) {
            console.error(error);
            setGuide("An error occurred while generating the guide.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card variant="glass">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    AI Legacy Assistant
                </CardTitle>
                <CardDescription>
                    Paste decrypted content and our AI will help you understand it
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <textarea
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 min-h-[120px] font-mono text-sm resize-none"
                    placeholder="Paste decrypted content here (e.g., 'My bitcoin seed is... and the deed is in...')"
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                />

                <Button
                    onClick={handleGenerate}
                    loading={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                    {loading ? (
                        <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Generating Guide...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate AI Guide
                        </>
                    )}
                </Button>

                {guide && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
                            <FileText className="w-5 h-5 text-purple-500" />
                            Generated Guide
                        </h3>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/30">
                            <div className="prose dark:prose-invert prose-sm max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {guide}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
