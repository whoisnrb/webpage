import { getContactMessages } from "@/app/actions/contact"
import { ContactList } from "./contact-list"
import { MessageSquare, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"

export const dynamic = 'force-dynamic'

export default async function AdminContactMessagesPage() {
    const messages = await getContactMessages()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#090d16]/30 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <Link href={"/admin" as any}>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">Kapcsolat üzenetek</h1>
                        <p className="text-slate-400 text-sm mt-1">A látogatók által beküldött kapcsolatfelvételi és foglalási üzenetek.</p>
                    </div>
                </div>
            </div>

            <ContactList initialMessages={messages as any} />
        </div>
    )
}
