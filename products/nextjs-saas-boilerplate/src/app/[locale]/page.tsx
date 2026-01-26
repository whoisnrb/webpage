import { Link } from '@/i18n/routing';

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white p-6">
            <div className="max-w-3xl text-center space-y-8">
                <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
                    v1.0 is now live 🚀
                </div>
                <h1 className="text-6xl font-extrabold tracking-tight">
                    Next.js SaaS Boilerplate
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    The ultimate foundation for your next big idea.
                    Auth, Payments, Admin, and I18n — all pre-configured and ready to ship.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/auth/signup"
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                        Get Started Now
                    </Link>
                    <Link
                        href="/pricing"
                        className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all"
                    >
                        View Pricing
                    </Link>
                </div>
                <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 opacity-50 grayscale">
                    <div className="text-sm font-semibold">NEXT.JS 15</div>
                    <div className="text-sm font-semibold">PRISMA</div>
                    <div className="text-sm font-semibold">STRIPE</div>
                    <div className="text-sm font-semibold">NEXTAUTH</div>
                </div>
            </div>
        </main>
    );
}
