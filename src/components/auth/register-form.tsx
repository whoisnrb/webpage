"use client";

import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { register } from "@/actions/register";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export const RegisterForm = () => {
    console.log("RegisterForm component loaded/rendered");
    const router = useRouter();
    const t = useTranslations("Auth.Register");
    const tForm = useTranslations("Auth.Form");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        console.log("Form submission started with values:", values);
        startTransition(() => {
            register(values)
                .then((data) => {
                    console.log("Server action finished. Response:", data);
                    if (data.error) {
                        console.error("Registration error:", data.error);
                        toast.error(data.error); // Server errors might be hardcoded in actions/register.ts, skipping for now unless moving logic to client
                    }
                    if (data.success) {
                        console.log("Registration success!");
                        toast.success(t("success"));
                        router.push("/auth/new-verification");
                    }
                })
                .catch((err) => {
                    console.error("Unexpected error in client submission:", err);
                    toast.error(t("unexpected_error"));
                });
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.error("Form validation failed!", errors);
                    toast.error(t("validation_error"));
                })}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{tForm("name")}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={tForm("name_placeholder")}
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
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending}
                    onClick={() => console.log("Register button clicked (direct handler)")}
                >
                    {isPending ? t("processing") : t("submit")}
                </Button>
            </form>
        </Form>
    );
};
