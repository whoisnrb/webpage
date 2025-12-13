"use client";

import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { login } from "@/actions/login";
import { toast } from "sonner";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { Turnstile } from "@/components/ui/turnstile";
import { useTranslations } from "next-intl";

export const LoginForm = () => {
    const t = useTranslations("Auth.Login");
    const tForm = useTranslations("Auth.Form");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        startTransition(() => {
            login(values).then((data) => {
                if (data?.error) {
                    toast.error(data.error);
                }
            });
        });
    };

    const handleGithubLogin = () => {
        signIn("github", { callbackUrl: "/dashboard" });
    };

    return (
        <div className="space-y-4">
            <Button
                variant="outline"
                className="w-full border-primary/50 hover:bg-primary/20 hover:text-primary-foreground transition-all duration-300"
                onClick={handleGithubLogin}
            >
                <Github className="mr-2 h-4 w-4" />
                {t("github")}
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted-foreground/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-muted-foreground">
                        {t("or")}
                    </span>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{tForm("email")}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder={tForm("email_placeholder")}
                                        type="email"
                                        disabled={isPending}
                                        className="bg-muted/50 border-muted-foreground/20"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{tForm("password")}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder={tForm("password_placeholder")}
                                        type="password"
                                        disabled={isPending}
                                        className="bg-muted/50 border-muted-foreground/20"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Turnstile onVerify={(token) => console.log("Turnstile token:", token)} />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? t("processing") : t("submit")}
                    </Button>
                </form>
            </Form>
        </div>
    );
};
