import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export const sendVerificationEmail = async (email: string, token: string) => {
    console.log(`[MAIL] Attempting to send verification email to: ${email}`);

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn("[MAIL] GMAIL_USER or GMAIL_APP_PASSWORD is not set. Email skipped.");
        console.log(`[DEV] Verification code for ${email}: ${token}`);
        return;
    }

    const mailOptions = {
        from: `"BacklineIT Team" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Fiók megerősítése - BacklineIT",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">Üdvözlünk a BacklineIT platformján!</h2>
                <p style="font-size: 16px; color: #555;">Köszönjük a regisztrációt! A fiókod aktiválásához kérjük, használd az alábbi 6 jegyű ellenőrző kódot:</p>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">${token}</span>
                </div>
                <p style="font-size: 14px; color: #777;">A kód 1 órán belül lejár. Ha nem te regisztráltál, hagyd figyelmen kívül ezt az üzenetet.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #aaa; text-align: center;">BacklineIT &bull; Minden jog fenntartva</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[MAIL] Verification email sent successfully to ${email}`);
    } catch (error) {
        console.error("[MAIL] Error sending verification email:", error);
        // Fallback for development
        console.log(`[FALLBACK] Verification code for ${email}: ${token}`);
    }
};

