import { getServices } from "@/app/actions/service"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { Plus, ArrowLeft } from "lucide-react"
import { ServiceList } from "./service-list"

export const dynamic = 'force-dynamic'

export default async function AdminServicesPage() {
    const services = await getServices()

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
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">Szolgáltatások</h1>
                        <p className="text-slate-400 text-sm mt-1">BacklineIT nyilvános szolgáltatási portfóliójának kezelése.</p>
                    </div>
                </div>
                <Link href={"/admin/services/new" as any}>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 text-white rounded-xl h-10 px-4 gap-2 font-semibold">
                        <Plus className="h-4 w-4" />
                        Új szolgáltatás
                    </Button>
                </Link>
            </div>

            <ServiceList initialServices={services as any} />
        </div>
    )
}
