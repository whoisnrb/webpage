"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, Legend } from "recharts"

interface DashboardChartsProps {
    monthlyData: Array<{
        name: string
        inquiries: number
        contacts: number
    }>
    ticketData: Array<{
        name: string
        new: number
        solved: number
    }>
}

export function DashboardCharts({ monthlyData, ticketData }: DashboardChartsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* Chart 1: Havi Statisztika */}
            <Card className="col-span-4 border border-white/5 bg-[#090d16]/40 rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-base font-bold text-white tracking-wide">Megkeresések & Kapcsolatok</CardTitle>
                    <p className="text-xs text-slate-400">Az elmúlt 6 hónap aktivitásának összehasonlítása.</p>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={monthlyData}>
                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value} db`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                                itemStyle={{ color: '#adfa1d' }}
                            />
                            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                            <Bar name="Megkeresések" dataKey="inquiries" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            <Bar name="Kapcsolat üzenetek" dataKey="contacts" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Chart 2: Heti Ticket aktivitás */}
            <Card className="col-span-3 border border-white/5 bg-[#090d16]/40 rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-base font-bold text-white tracking-wide">Jegyek Aktivitása</CardTitle>
                    <p className="text-xs text-slate-400">Az elmúlt 7 nap beérkezett és megoldott hibajegyei.</p>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={ticketData}>
                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            />
                            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                            <Line type="monotone" dataKey="new" stroke="#ef4444" strokeWidth={2} name="Új" dot={{ fill: '#ef4444' }} />
                            <Line type="monotone" dataKey="solved" stroke="#22c55e" strokeWidth={2} name="Megoldva" dot={{ fill: '#22c55e' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
