"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, Users, Server, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

type Metric = {
    key: string;
    value: number;
    label: string;
    icon: string | null;
};

const IconMap: Record<string, any> = {
    CheckCircle,
    Clock,
    Users,
    Server,
    Activity
};

export function MetricsSection() {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);
    const t = useTranslations("HomePage"); // Assuming we have keys here, or fallback to API label

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const res = await fetch("/api/public/metrics");
                if (res.ok) {
                    const data = await res.json();
                    setMetrics(data);
                }
            } catch (error) {
                console.error("Failed to load metrics", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMetrics();
    }, []);

    if (loading) return null; // Or skeleton

    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">{t('stats_projects_title')}</h2>
                    {/* Using existing title or generic "Our Impact" */}
                    <p className="text-muted-foreground">{t('stats_projects_desc')}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {metrics.map((metric) => {
                        const Icon = metric.icon && IconMap[metric.icon] ? IconMap[metric.icon] : Activity;
                        return (
                            <Card key={metric.key} className="border-none shadow-sm bg-muted/20 text-center hover:bg-muted/40 transition-colors">
                                <CardHeader className="flex flex-col items-center pb-2">
                                    <div className="p-3 bg-primary/10 rounded-full mb-4 text-primary">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-4xl font-extrabold text-foreground">
                                        {metric.value}{metric.key === 'uptime' ? '%' : '+'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                                        {metric.label}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
