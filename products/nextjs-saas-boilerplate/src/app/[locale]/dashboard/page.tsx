import { Link } from '@/i18n/routing';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Bell, Search } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 p-6 space-y-8 hidden md:block">
                <div className="font-bold text-2xl px-2">SaaS App</div>
                <nav className="space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-xl font-medium">
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link href="/dashboard/members" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all">
                        <Users className="w-5 h-5" /> Members
                    </Link>
                    <Link href="/dashboard/billing" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all">
                        <CreditCard className="w-5 h-5" /> Billing
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all">
                        <Settings className="w-5 h-5" /> Settings
                    </Link>
                </nav>
                <div className="pt-8 border-t border-slate-800">
                    <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-all w-full">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                        <p className="text-slate-400">Welcome back to your workspace.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-slate-900 border-slate-800 rounded-full pl-10 pr-4 py-2 focus:ring-1 focus:ring-blue-500 outline-none w-64"
                            />
                        </div>
                        <button className="p-2 bg-slate-900 border border-slate-800 rounded-full relative">
                            <Bell className="w-5 h-5" />
                            <span className="w-2 h-2 bg-blue-500 rounded-full absolute top-2 right-2 border border-slate-900"></span>
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full"></div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Total Revenue', value: '$12,450', change: '+12.5%' },
                        { label: 'Active Users', value: '1,240', change: '+5.2%' },
                        { label: 'New Signups', value: '45', change: '-2.1%' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                            <div className="text-slate-400 mb-1">{stat.label}</div>
                            <div className="text-2xl font-bold flex items-center justify-between">
                                {stat.value}
                                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 h-96 flex items-center justify-center text-slate-500">
                    Analytics chart placeholder
                </div>
            </main>
        </div>
    );
}
