"use client"

import * as React from "react"
import { Check, Globe, HelpCircle, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { CURRENCIES, CurrencyCode } from "@/lib/currency"
import { useCurrency } from "@/components/currency-provider"

export function CurrencySwitcher() {
    const { currency: currentCurrency, setCurrency } = useCurrency();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 hover:bg-muted/50">
                    <Coins className="h-4 w-4 text-primary/70" />
                    <span className="text-xs font-bold uppercase tracking-wider">{currentCurrency}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] p-2">
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1.5">
                    Currency Settings
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 opacity-50" />
                {Object.values(CURRENCIES).map((c) => (
                    <DropdownMenuItem
                        key={c.code}
                        onClick={() => setCurrency(c.code as CurrencyCode)}
                        className="flex items-center justify-between rounded-md px-2 py-2 text-sm cursor-pointer transition-colors hover:bg-primary/5"
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex h-6 w-8 items-center justify-center rounded bg-muted/30 text-[10px] font-black">
                                {c.symbol}
                            </span>
                            <div className="flex flex-col">
                                <span className="font-bold tracking-tight leading-none mb-1">{c.code}</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{c.label}</span>
                            </div>
                        </div>
                        {currentCurrency === c.code && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                                <Check className="h-3 w-3 text-primary" />
                            </div>
                        )}
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="my-2 opacity-50" />
                <div className="px-2 py-1.5 flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/20 rounded-md">
                    <HelpCircle size={12} />
                    <span>Real-time conversion estimated</span>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
