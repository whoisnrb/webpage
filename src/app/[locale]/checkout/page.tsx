"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/components/ecommerce/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Loader2, ShieldCheck, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"
import { Link } from "@/i18n/routing"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ clientSecret, onSuccess }: { clientSecret: string, onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const t = useTranslations('Checkout');

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/payment/success`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
            {message && <div id="payment-message" className="text-sm text-red-500">{message}</div>}
            <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full">
                <span id="button-text">
                    {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                    {t('pay_now')}
                </span>
            </Button>
            <div className="flex justify-center gap-4 mt-4 opacity-70 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>Powered by Stripe</span>
                </div>
            </div>
        </form>
    );
}

export default function CheckoutPage() {
    const t = useTranslations('Checkout')
    const { items, total } = useCart()
    const router = useRouter()
    const [clientSecret, setClientSecret] = useState("")
    const [waiverAccepted, setWaiverAccepted] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    })

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads (if items exist)
        if (items.length > 0) {
            fetch("/api/payment/create-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, customer: formData }),
            })
                .then((res) => res.json())
                .then((data) => setClientSecret(data.clientSecret));
        }
    }, [items, total]); // Depend on total/items if they change

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">{t('empty_cart')}</h1>
                <Button onClick={() => router.push("/")}>{t('back_to_home')}</Button>
            </div>
        )
    }

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#0f172a',
        },
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-16">
            <h1 className="text-3xl font-bold mb-8 text-center">{t('title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Order Summary */}
                <div className="space-y-6">
                    <Card className="p-6 bg-muted/30">
                        <h2 className="text-xl font-semibold mb-4">{t('summary_title')}</h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={`${item.id}-${item.license}`} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground capitalize">{item.license} license</p>
                                    </div>
                                    <PriceDisplay amount={item.price} className="font-medium" />
                                </div>
                            ))}
                            <div className="pt-4 border-t flex justify-between items-center text-lg font-bold">
                                <span>{t('total_label')}</span>
                                <PriceDisplay amount={total} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {t('vat_included')}
                            </p>
                        </div>
                    </Card>

                    {/* Customer Info (Collected here for Context, though Stripe collects some too) */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-6">{t('billing_title')}</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('name_label')}</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={t('name_placeholder')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('email_label')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder={t('email_placeholder')}
                                />
                            </div>
                            <div className="pt-4 border-t space-y-4">
                                <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg border border-primary/20">
                                    <Checkbox
                                        id="waiver"
                                        checked={waiverAccepted}
                                        onCheckedChange={(checked) => setWaiverAccepted(checked as boolean)}
                                        className="mt-1"
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label
                                            htmlFor="waiver"
                                            className="text-sm font-medium leading-normal cursor-pointer"
                                        >
                                            {t('waiver_label')}
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            {t('waiver_subtext')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="terms"
                                        checked={termsAccepted}
                                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label
                                            htmlFor="terms"
                                            className="text-sm font-medium leading-none cursor-pointer"
                                        >
                                            {t.rich('terms_label', {
                                                link1: (chunks) => <Link href="/aszf" target="_blank" className="text-primary hover:underline">{chunks}</Link>,
                                                link2: (chunks) => <Link href="/adatvedelem" target="_blank" className="text-primary hover:underline">{chunks}</Link>
                                            })}
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Stripe Payment Element */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
                        {clientSecret && waiverAccepted && termsAccepted ? (
                            // @ts-ignore
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm clientSecret={clientSecret} onSuccess={() => { }} />
                            </Elements>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                {!waiverAccepted || !termsAccepted ? (
                                    <p>Please accept the terms and waiver to proceed to payment.</p>
                                ) : (
                                    <Loader2 className="animate-spin h-8 w-8 mx-auto" />
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}
