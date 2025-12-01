"use client";

import * as React from "react";
import { useTransition, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

export const NewVerificationForm = () => {
    const [token, setToken] = useState("");
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(undefined);
        setSuccess(undefined);

        if (!token || token.length < 6) {
            setError("Kérlek add meg a 6 jegyű kódot!");
            return;
        }

        startTransition(() => {
            newVerification(token)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                        toast.error(data.error);
                    }
                    if (data.success) {
                        setSuccess(data.success);
                        toast.success(data.success);
                        setTimeout(() => {
                            router.push("/login");
                        }, 2000);
                    }
                })
                .catch(() => {
                    setError("Valami hiba történt!");
                    toast.error("Valami hiba történt!");
                });
        });
    };

    return (
        <Card className="w-full max-w-md glass border-0 shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Fiók megerősítése</CardTitle>
                <CardDescription className="text-center">
                    Kérlek add meg az emailben kapott 6 jegyű kódot.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            disabled={isPending}
                            placeholder="123456"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="text-center text-2xl tracking-widest"
                            maxLength={6}
                        />
                    </div>
                    {error && (
                        <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 rounded-md bg-emerald-500/15 text-emerald-500 text-sm text-center">
                            {success}
                        </div>
                    )}
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Ellenőrzés..." : "Megerősítés"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <Button variant="link" onClick={() => router.push("/login")}>
                    Vissza a bejelentkezéshez
                </Button>
            </CardFooter>
        </Card>
    );
};
