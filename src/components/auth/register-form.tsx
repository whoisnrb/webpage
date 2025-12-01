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

export const RegisterForm = () => {
    console.log("RegisterForm component loaded/rendered");
    const router = useRouter();
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
                        toast.error(data.error);
                    }
                    if (data.success) {
                        console.log("Registration success!");
                        toast.success(data.success);
                        router.push("/auth/new-verification");
                    }
                })
                .catch((err) => {
                    console.error("Unexpected error in client submission:", err);
                    toast.error("Váratlan hiba történt.");
                });
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.error("Form validation failed!", errors);
                    toast.error("Kérlek ellenőrizd a mezőket!");
                })}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Név</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Kovács János"
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="pelda@email.hu"
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
                            <FormLabel>Jelszó</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="******"
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
                    {isPending ? "Regisztráció..." : "Regisztráció"}
                </Button>
            </form>
        </Form>
    );
};
