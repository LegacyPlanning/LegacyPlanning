"use server";

import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "gsk_key", // Fallback for build, but needs real key
});

export async function generateLegacyGuide(decryptedContent: string) {
    if (!process.env.GROQ_API_KEY) {
        console.warn("GROQ_API_KEY is not set.");
        return "Error: AI Service not configured (Missing API Key).";
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a compassionate and organized Legacy Planning Assistant. Your goal is to help beneficiaries understand the wishes of their loved one. You will receive raw instructions or asset details. Please summarize them into a clear, step-by-step generic guide. Do not include sensitive secrets (like passwords) in the output if they are plain text, but guide them on how to use them safely.",
                },
                {
                    role: "user",
                    content: `Here is the decrypted content from the legacy vault:\n\n${decryptedContent}\n\nPlease generate a clear guide for the beneficiary.`,
                },
            ],
            model: "llama3-70b-8192",
        });

        return chatCompletion.choices[0]?.message?.content || "Could not generate guide.";
    } catch (error) {
        console.error("Groq AI Error:", error);
        return "Error generating guide. Please try again later.";
    }
}
