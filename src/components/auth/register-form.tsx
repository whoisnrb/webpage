"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { register } from "@/actions/register";
import { toast } from "sonner";
import { useRouter, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    Loader2,
    ArrowRight,
    Sparkles,
    ShieldCheck,
} from "lucide-react";

export const RegisterForm = () => {
    const router = useRouter();
    const t = useTranslations("Auth.Register");
    const tForm = useTranslations("Auth.Form");
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            terms: false,
            newsletter: false,
        },
    });

    // Password strength calculation
    const watchPassword = form.watch("password") || "";
    const passwordStrength = React.useMemo(() => {
        if (!watchPassword) return 0;
        let score = 0;
        if (watchPassword.length >= 6) score += 1;
        if (watchPassword.length >= 10) score += 1;
        if (/[A-Z]/.test(watchPassword)) score += 1;
        if (/[0-9]/.test(watchPassword) || /[^A-Za-z0-9]/.test(watchPassword)) score += 1;
        return score;
    }, [watchPassword]);

    const strengthLabel = React.useMemo(() => {
        if (!watchPassword) return "";
        if (passwordStrength <= 1) return "Gyenge";
        if (passwordStrength === 2) return "Közepes";
        if (passwordStrength === 3) return "Jó";
        return "Nagyon erős";
    }, [watchPassword, passwordStrength]);

    const strengthColor = React.useMemo(() => {
        if (passwordStrength <= 1) return "bg-red-500 text-red-400";
        if (passwordStrength === 2) return "bg-amber-500 text-amber-400";
        if (passwordStrength === 3) return "bg-cyan-500 text-cyan-400";
        return "bg-emerald-500 text-emerald-400";
    }, [passwordStrength]);

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        startTransition(() => {
            register(values)
                .then((data) => {
                    if (data.error) {
                        toast.error(data.error);
                    }
                    if (data.success) {
                        toast.success("Sikeres regisztráció! Megerősítő e-mailt küldtünk.");
                        router.push("/auth/new-verification" as any);
                    }
                })
                .catch((err) => {
                    console.error("Hiba a regisztráció során:", err);
                    toast.error("Váratlan hiba történt. Kérjük próbáld újra később.");
                });
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    if (errors.terms) {
                        toast.error("Az ÁSZF elfogadása kötelező a regisztrációhoz!");
                    } else {
                        toast.error("Kérjük töltsd ki megfelelően az összes kötelező mezőt!");
                    }
                })}
                className="space-y-4"
            >
                {/* NÉV MEZŐ */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Teljes név *
                            </FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                                    <Input
                                        {...field}
                                        placeholder="Kovács János"
                                        disabled={isPending}
                                        className="h-11 pl-10 bg-[#060a15] border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all text-sm"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-xs text-red-400" />
                        </FormItem>
                    )}
                />

                {/* EMAIL MEZŐ */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                E-mail cím *
                            </FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                                    <Input
                                        {...field}
                                        placeholder="janos@cegnev.hu"
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

                {/* JELSZÓ MEZŐ */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Jelszó *
                                </FormLabel>
                                {watchPassword && (
                                    <span className={`text-[11px] font-medium ${strengthColor.split(" ")[1]}`}>
                                        {strengthLabel}
                                    </span>
                                )}
                            </div>
                            <FormControl>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                                    <Input
                                        {...field}
                                        placeholder="Minimum 6 karakter..."
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

                            {/* Password strength progress bar */}
                            {watchPassword && (
                                <div className="grid grid-cols-4 gap-1.5 pt-1">
                                    {[1, 2, 3, 4].map((step) => (
                                        <div
                                            key={step}
                                            className={`h-1 rounded-full transition-all duration-300 ${
                                                passwordStrength >= step
                                                    ? strengthColor.split(" ")[0]
                                                    : "bg-white/10"
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}

                            <FormMessage className="text-xs text-red-400" />
                        </FormItem>
                    )}
                />

                {/* CHECKBOXOK SZEKCIÓ */}
                <div className="pt-2 space-y-3">
                    {/* KÖTELEZŐ: ÁSZF CHECKBOX */}
                    <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isPending}
                                            className="mt-0.5 border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:text-black"
                                        />
                                    </FormControl>
                                    <div className="text-xs leading-relaxed text-slate-300">
                                        Elfogadom az{" "}
                                        <Link
                                            href="/aszf"
                                            target="_blank"
                                            className="text-cyan-400 font-medium underline underline-offset-2 hover:text-cyan-300 transition-colors"
                                        >
                                            Általános Szerződési Feltételeket
                                        </Link>{" "}
                                        és az{" "}
                                        <Link
                                            href="/adatvedelem"
                                            target="_blank"
                                            className="text-cyan-400 font-medium underline underline-offset-2 hover:text-cyan-300 transition-colors"
                                        >
                                            Adatkezelési Tájékoztatót
                                        </Link>
                                        . <span className="text-cyan-400 font-bold">*</span>
                                    </div>
                                </div>
                                <FormMessage className="text-xs text-red-400 pl-1" />
                            </FormItem>
                        )}
                    />

                    {/* NEM KÖTELEZŐ: HÍRLEVÉL CHECKBOX */}
                    <FormField
                        control={form.control}
                        name="newsletter"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/15 hover:border-cyan-500/30 transition-colors">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isPending}
                                            className="mt-0.5 border-cyan-500/40 data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400 data-[state=checked]:text-black"
                                        />
                                    </FormControl>
                                    <div className="space-y-0.5">
                                        <div className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                                            <span>Feliratkozom a BacklineIT heti hírlevelére</span>
                                            <span className="text-[10px] bg-cyan-400/15 text-cyan-300 font-semibold px-1.5 py-0.2 rounded border border-cyan-400/20">
                                                Ajánlott
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-tight">
                                            Heti 1 szakmai összefoglaló IT trendekről és gyakorlati automatizációs tippekről. Bármikor leiratkozhatsz.
                                        </p>
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                {/* SUBMIT GOMB */}
                <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 mt-2 group"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin text-black" />
                            <span>Fiók létrehozása...</span>
                        </>
                    ) : (
                        <>
                            <span>Fiók létrehozása</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
};
