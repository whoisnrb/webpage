"use client";

import * as React from "react";
import { useState, useTransition, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { login } from "@/actions/login";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { Turnstile } from "@/components/ui/turnstile";
import { useTranslations } from "next-intl";

export const LoginForm = () => {
    const t = useTranslations("Auth.Login");
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);

    const localizedSchema = useMemo(() => {
        return z.object({
            email: z.string().email({
                message: t("validation_email_required"),
            }),
            password: z.string().min(1, {
                message: t("validation_password_required"),
            }),
        });
    }, [t]);

    const form = useForm<z.infer<typeof localizedSchema>>({
        resolver: zodResolver(localizedSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof localizedSchema>) => {
        startTransition(() => {
            login(values)
                .then((data) => {
                    if (data?.error) {
                        toast.error(data.error);
                    }
                })
                .catch((err) => {
                    console.error("Bejelentkezési hiba:", err);
                    toast.error(t("error_generic"));
                });
        });
    };

    const handleGithubLogin = () => {
        signIn("github", { callbackUrl: "/dashboard" });
    };

    return (
        <div className="space-y-5">
            {/* GitHub gyorsbejelentkezés */}
            <Button
                type="button"
                variant="outline"
                className="w-full h-11 bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-cyan-500/30 text-white rounded-xl transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2.5 shadow-sm group"
                onClick={handleGithubLogin}
            >
                <svg className="h-4 w-4 fill-current text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>{t("github")}</span>
            </Button>

            {/* Elválasztó sáv */}
            <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
                    <span className="bg-[#090d19] px-3 text-slate-500">
                        {t("or_email")}
                    </span>
                </div>
            </div>

            {/* Űrlap */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* EMAIL */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    {t("email_label")}
                                </FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                                        <Input
                                            {...field}
                                            placeholder={t("email_placeholder")}
                                            type="email"
                                            disabled={isPending}
                                            className="h-11 pl-10 bg-[#060a15] border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all text-sm"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs text-red-400" />
                            </FormItem>
                        )}
                    />

                    {/* JELSZÓ */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                        {t("password_label")}
                                    </FormLabel>
                                </div>
                                <FormControl>
                                    <div className="relative group">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                                        <Input
                                            {...field}
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            disabled={isPending}
                                            className="h-11 pl-10 pr-10 bg-[#060a15] border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-0.5"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs text-red-400" />
                            </FormItem>
                        )}
                    />

                    <Turnstile onVerify={(token) => console.log("Turnstile token:", token)} />

                    {/* SUBMIT BUTTON */}
                    <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 mt-2 group"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin text-black" />
                                <span>{t("processing")}</span>
                            </>
                        ) : (
                            <>
                                <span>{t("submit")}</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};
