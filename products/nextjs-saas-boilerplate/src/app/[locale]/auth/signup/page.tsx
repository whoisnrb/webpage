import { Link } from '@/i18n/routing';

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
            <div className="w-full max-w-md space-y-8 bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight">Create an account</h2>
                    <p className="mt-2 text-slate-400">Join our SaaS platform today.</p>
                </div>

                <form className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                        Sign up
                    </button>
                </form>

                <div className="relative flex items-center justify-center">
                    <span className="absolute bg-slate-900 px-4 text-sm text-slate-500 uppercase">Or continue with</span>
                    <div className="w-full border-t border-slate-800"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-all">GitHub</button>
                    <button className="py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-all">Google</button>
                </div>

                <p className="text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="text-blue-500 hover:underline font-semibold">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
