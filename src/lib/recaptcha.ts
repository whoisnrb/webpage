"use server";

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

interface RecaptchaVerifyResponse {
    success: boolean;
    score?: number;
    action?: string;
    challenge_ts?: string;
    hostname?: string;
    "error-codes"?: string[];
}

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; score: number }> {
    try {
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
        });

        const data: RecaptchaVerifyResponse = await response.json();

        return {
            success: data.success && (data.score ?? 0) >= 0.5,
            score: data.score ?? 0,
        };
    } catch (error) {
        console.error("reCAPTCHA verification error:", error);
        return { success: false, score: 0 };
    }
}
