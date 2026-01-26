import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Check } from 'lucide-react';

export default function PricingPage() {
    const t = useTranslations('pricing');

    const plans = [
        {
            name: t('starter'),
            price: '$29',
            description: 'Perfect for individuals and side projects.',
            features: [
                t('features.auth'),
                t('features.i18n'),
            ],
            cta: t('buyNow'),
            highlighted: false,
        },
        {
            name: t('pro'),
            price: '$99',
            description: 'Advanced features for growing startups.',
            features: [
                t('features.auth'),
                t('features.payments'),
                t('features.dashboard'),
                t('features.i18n'),
                t('features.support'),
            ],
            cta: t('buyNow'),
            highlighted: true,
        },
        {
            name: t('enterprise'),
            price: 'Custom',
            description: 'Scale your SaaS with enterprise-grade solutions.',
            features: [
                t('features.auth'),
                t('features.payments'),
                t('features.dashboard'),
                t('features.i18n'),
                t('features.support'),
                t('features.custom'),
            ],
            cta: 'Contact Us',
            highlighted: false,
        },
    ];

    return (
        <div className="bg-slate-950 min-h-screen text-white py-24 px-6">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-5xl font-extrabold mb-4">{t('title')}</h1>
                <p className="text-xl text-slate-400">{t('subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`p-8 rounded-3xl border ${plan.highlighted
                                ? 'bg-slate-900 border-blue-500 shadow-2xl shadow-blue-500/10 scale-105'
                                : 'bg-slate-900/50 border-slate-800'
                            } flex flex-col`}
                    >
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <div className="text-4xl font-extrabold mb-4">{plan.price}</div>
                        <p className="text-slate-400 mb-8 flex-grow">{plan.description}</p>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-slate-300">
                                    <Check className="w-5 h-5 text-blue-500" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/auth/signup"
                            className={`w-full py-4 rounded-xl font-bold text-center transition-all ${plan.highlighted
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-slate-800 hover:bg-slate-700'
                                }`}
                        >
                            {plan.cta}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
