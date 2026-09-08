import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Email megerősítés | BacklineIT",
    robots: {
        index: false,
        follow: false,
    },
};

export default function NewVerificationPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
            <NewVerificationForm />
        </div>
    );
}
