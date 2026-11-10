import { Metadata } from "next"
import { getMissionControlData } from "@/app/actions/mission-control"
import { MissionControlClient } from "./mission-control-client"

export const metadata: Metadata = {
    title: "Mission Control // War Room | BacklineIT Admin",
    description: "Valós idejű telemetria, Azure felhő infrastruktúra és globális műveleti központ.",
}

// Mindig friss adatot kér le az oldal megnyitásakor
export const dynamic = 'force-dynamic'

export default async function MissionControlPage() {
    const data = await getMissionControlData()

    return <MissionControlClient initialData={data} />
}
