import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined")
}

const resend = new Resend(process.env.RESEND_API_KEY)

const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

export async function sendWelcomeEmail(email: string, name: string) {
    try {
        await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}!`,
            html: `
        <h1>Welcome ${name}!</h1>
        <p>Thanks for signing up to ${process.env.NEXT_PUBLIC_APP_NAME}.</p>
        <p>We're excited to have you on board.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Go to Dashboard</a>
      `,
        })
    } catch (error) {
        console.error("Failed to send welcome email:", error)
    }
}

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`

    try {
        await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: "Reset your password",
            html: `
        <h1>Reset your password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
        })
    } catch (error) {
        console.error("Failed to send password reset email:", error)
    }
}

export async function sendSubscriptionConfirmation(
    email: string,
    plan: string
) {
    try {
        await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: "Subscription Confirmed",
            html: `
        <h1>Subscription Confirmed!</h1>
        <p>Your ${plan} subscription is now active.</p>
        <p>Thank you for your purchase!</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing">Manage Subscription</a>
      `,
        })
    } catch (error) {
        console.error("Failed to send subscription confirmation:", error)
    }
}
