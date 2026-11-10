'use client'

import { useState } from "react"
import { 
    Users, Shield, Crown, Code2, Briefcase, User, Search, 
    Check, AlertCircle, Clock, Folder, Ticket, Info
} from "lucide-react"
import { TeamMemberDTO, updateUserRole, RoleType } from "@/app/actions/team"
import { Button } from "@/components/ui/button"

const ROLE_CONFIG: Record<string, { label: string; icon: any; color: string; badge: string; desc: string }> = {
    SUPER_ADMIN: {
        label: "Főadminisztrátor",
        icon: Crown,
        color: "text-amber-400",
        badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        desc: "Minden funkcióhoz és pénzügyhöz teljes hozzáférés."
    },
    ADMIN: {
        label: "Rendszergazda",
        icon: Shield,
        color: "text-cyan-400",
        badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
        desc: "Admin felület, tartalom és infrastruktúra kezelése."
    },
    DEVELOPER: {
        label: "Fejlesztő / Sysadmin",
        icon: Code2,
        color: "text-purple-400",
        badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
        desc: "Mission Control, logok, cronok, ticketek és rendszer."
    },
    SALES: {
        label: "Értékesítő / PM",
        icon: Briefcase,
        color: "text-emerald-400",
        badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        desc: "CRM, megkeresések, meetingek és referenciák."
    },
    USER: {
        label: "Ügyfél (Normál)",
        icon: User,
        color: "text-slate-400",
        badge: "bg-slate-800 text-slate-400 border-slate-700",
        desc: "Csak az ügyfélportálhoz és saját ticketjeihez fér hozzá."
    }
}

export function TeamClient({ initialMembers }: { initialMembers: TeamMemberDTO[] }) {
    const [members, setMembers] = useState<TeamMemberDTO[]>(initialMembers)
    const [search, setSearch] = useState("")
    const [filterRole, setFilterRole] = useState<string>("ALL")
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null)

    const filtered = members.filter(m => {
        const matchesSearch = !search || 
            (m.name && m.name.toLowerCase().includes(search.toLowerCase())) ||
            (m.email && m.email.toLowerCase().includes(search.toLowerCase()))
        const matchesRole = filterRole === "ALL" || m.role === filterRole
        return matchesSearch && matchesRole
    })

    const handleRoleChange = async (userId: string, newRole: RoleType) => {
        setLoadingId(userId)
        setStatusMsg(null)
        try {
            await updateUserRole(userId, newRole)
            setMembers(prev => prev.map(m => m.id === userId ? { ...m, role: newRole } : m))
            setStatusMsg({ text: `Szerepkör sikeresen frissítve: ${ROLE_CONFIG[newRole]?.label || newRole}` })
        } catch (e: any) {
            setStatusMsg({ text: e.message || "Hiba történt a módosítás során", error: true })
        } finally {
            setLoadingId(null)
            setTimeout(() => setStatusMsg(null), 4000)
        }
    }

    const adminCount = members.filter(m => ['ADMIN', 'SUPER_ADMIN'].includes(m.role)).length
    const devCount = members.filter(m => m.role === 'DEVELOPER').length
    const salesCount = members.filter(m => m.role === 'SALES').length
    const userCount = members.filter(m => m.role === 'USER').length

    return (
        <div className="space-y-6">
            {/* Header & Összesítő */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#090d16]/40 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                <div>
                    <div className="flex items-center gap-2">
                        <Users className="w-6 h-6 text-cyan-400" />
                        <h2 className="text-2xl font-bold tracking-tight text-white">Csapat & Jogosultságok (RBAC)</h2>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">
                        Munkatársak szerepköreinek, hozzáféréseinek és felügyeletének kezelése.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <span className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-300">
                        {adminCount} Admin
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300">
                        {devCount} Fejlesztő
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
                        {salesCount} Sales / PM
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400">
                        {userCount} Ügyfél
                    </span>
                </div>
            </div>

            {/* Szerepkör magyarázó kártyák */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(ROLE_CONFIG).filter(([k]) => k !== 'USER').map(([key, cfg]) => {
                    const Icon = cfg.icon
                    return (
                        <div key={key} className="p-4 rounded-xl bg-[#070b16] border border-white/5 space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Icon className={`w-4 h-4 ${cfg.color}`} />
                                <span className="font-bold text-xs text-white uppercase tracking-wider">{cfg.label}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug">{cfg.desc}</p>
                        </div>
                    )
                })}
            </div>

            {/* Visszajelző toast */}
            {statusMsg && (
                <div className={`p-3.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-2 transition-all ${
                    statusMsg.error 
                        ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                    {statusMsg.error ? <AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> : <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>{statusMsg.text}</span>
                </div>
            )}

            {/* Szűrők és Kereső */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#070b16] border border-white/5 p-3 rounded-xl">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Keresés név vagy e-mail cím alapján..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                    {['ALL', 'SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'SALES', 'USER'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setFilterRole(r)}
                            className={`px-3 py-1.5 rounded-lg border font-mono text-[11px] transition-all whitespace-nowrap ${
                                filterRole === r
                                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold'
                                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {r === 'ALL' ? 'Mind' : ROLE_CONFIG[r]?.label || r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Felhasználók Listája */}
            <div className="rounded-2xl border border-white/5 bg-[#070b16] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-[#0b101e] border-b border-white/5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="p-4">Felhasználó / Munkatárs</th>
                                <th className="p-4">Jelenlegi Szerepkör</th>
                                <th className="p-4">Statisztika</th>
                                <th className="p-4">Regisztráció</th>
                                <th className="p-4 text-right">Jogosultság Állítása</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500 font-mono text-xs">
                                        Nem található a keresésnek megfelelő felhasználó.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((member) => {
                                    const cfg = ROLE_CONFIG[member.role] || ROLE_CONFIG.USER
                                    const Icon = cfg.icon
                                    const isLoading = loadingId === member.id

                                    return (
                                        <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                                            {/* Név & Email */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-900/50 to-purple-900/50 border border-white/10 flex items-center justify-center font-bold text-white uppercase text-xs shrink-0">
                                                        {member.name ? member.name.slice(0, 2) : member.email?.slice(0, 2) || 'U'}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-white block">
                                                            {member.name || 'Névtelen felhasználó'}
                                                        </span>
                                                        <span className="text-[11px] font-mono text-slate-400 block">
                                                            {member.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Szerepkör Badge */}
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.badge}`}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                    {cfg.label}
                                                </span>
                                            </td>

                                            {/* Statisztika */}
                                            <td className="p-4 font-mono text-[11px] text-slate-400">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1" title="Hibajegyek">
                                                        <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                                                        {member.ticketCount}
                                                    </span>
                                                    <span className="flex items-center gap-1" title="Ügyfél Projektek">
                                                        <Folder className="w-3.5 h-3.5 text-purple-400" />
                                                        {member.projectCount}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Dátum */}
                                            <td className="p-4 font-mono text-[11px] text-slate-400">
                                                {new Date(member.createdAt).toLocaleDateString('hu-HU')}
                                            </td>

                                            {/* Szerepkör választó gombok */}
                                            <td className="p-4 text-right">
                                                <select
                                                    disabled={isLoading}
                                                    value={member.role}
                                                    onChange={(e) => handleRoleChange(member.id, e.target.value as RoleType)}
                                                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 cursor-pointer disabled:opacity-50"
                                                >
                                                    <option value="SUPER_ADMIN">Főadminisztrátor (SUPER_ADMIN)</option>
                                                    <option value="ADMIN">Rendszergazda (ADMIN)</option>
                                                    <option value="DEVELOPER">Fejlesztő (DEVELOPER)</option>
                                                    <option value="SALES">Értékesítő / PM (SALES)</option>
                                                    <option value="USER">Ügyfél (USER)</option>
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
