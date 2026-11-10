import { Metadata } from "next"
import { getLiveTrafficData } from "@/app/actions/live-traffic"
import { LiveMapClient } from "./live-map-client"

export const metadata: Metadata = {
    title: "Élő Látogatói Térkép & Forgalom | BacklineIT Admin",
    description: "Valós idejű látogatói forgalomfigyelés és 3D hőtérkép.",
}

export const dynamic = 'force-dynamic'

export default async function LiveMapPage() {
    const data = await getLiveTrafficData()

    return <LiveMapClient initialData={data} />
}
