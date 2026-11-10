import { Metadata } from "next"
import { getTeamMembers } from "@/app/actions/team"
import { TeamClient } from "./team-client"

export const metadata: Metadata = {
    title: "Csapat & Jogosultságok (RBAC) | BacklineIT Admin",
    description: "Munkatársak jogosultságainak és szerepköreinek felügyelete.",
}

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
    const members = await getTeamMembers()

    return <TeamClient initialMembers={members} />
}
