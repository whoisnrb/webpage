"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Mail, Save, Loader2, CheckCircle2 } from "lucide-react"
import { updateProfile } from "@/app/actions/user"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRouter } from "@/i18n/routing"

interface SettingsFormProps {
    initialName: string
    userEmail: string
    labels: {
        profileInfo: string
        updateProfile: string
        emailLabel: string
        emailNotEditable: string
        nameLabel: string
        namePlaceholder: string
        save: string
        saved: string
        saving: string
    }
}

export function SettingsForm({ initialName, userEmail, labels }: SettingsFormProps) {
    const [name, setName] = React.useState(initialName)
    const [isPending, startTransition] = React.useTransition()
    const [isSaved, setIsSaved] = React.useState(false)
    const { update } = useSession()
    const router = useRouter()

    React.useEffect(() => {
        setName(initialName)
    }, [initialName])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!name.trim()) {
            toast.error("A név nem lehet üres!")
            return
        }

        startTransition(async () => {
            const res = await updateProfile(name)
            if (res.success) {
                setIsSaved(true)
                toast.success("Profil adatok sikeresen elmentve!")
                // Kliens oldali NextAuth munkamenet és Server Components frissítése
                if (update) {
                    await update({ name: name.trim() })
                }
                router.refresh()
                setTimeout(() => setIsSaved(false), 3000)
            } else {
                toast.error(res.error || "Hiba történt a mentés során")
            }
        })
    }

    return (
        <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                </div>
                <div>
                    <p className="font-semibold text-sm">{labels.profileInfo}</p>
                    <p className="text-xs text-muted-foreground">{labels.updateProfile}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
                {/* Email — read only */}
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                        <Mail className="h-3 w-3" />
                        {labels.emailLabel}
                    </Label>
                    <div className="relative">
                        <Input
                            id="email"
                            value={userEmail}
                            disabled
                            className="bg-white/5 border-white/8 text-muted-foreground pr-20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground/60 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                            Nem módosítható
                        </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/60">{labels.emailNotEditable}</p>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                        <User className="h-3 w-3" />
                        {labels.nameLabel}
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={labels.namePlaceholder}
                        disabled={isPending}
                        className="bg-white/5 border-white/8 focus:border-primary/50 transition-colors"
                    />
                </div>

                <div className="pt-1 flex items-center gap-3">
                    <Button 
                        type="submit" 
                        disabled={isPending}
                        className="inline-flex items-center gap-2 cursor-pointer transition-all duration-200"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                <span>{labels.saving}</span>
                            </>
                        ) : isSaved ? (
                            <>
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                <span>{labels.saved}</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                <span>{labels.save}</span>
                            </>
                        )}
                    </Button>
                    {isSaved && (
                        <span className="text-xs text-emerald-400 font-medium animate-fadeIn">
                            Módosítások sikeresen elmentve!
                        </span>
                    )}
                </div>
            </form>
        </div>
    )
}
