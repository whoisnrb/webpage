import { Badge } from "@/components/ui/badge"

interface TicketStatusBadgeProps {
    status: string
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
        OPEN: { variant: "default", label: "Nyitott" },
        IN_PROGRESS: { variant: "secondary", label: "Folyamatban" },
        WAITING_FOR_CUSTOMER: { variant: "outline", label: "Ügyfélre vár" },
        RESOLVED: { variant: "outline", label: "Megoldva" },
        CLOSED: { variant: "secondary", label: "Lezárva" }
    }

    const config = variants[status] || { variant: "outline" as const, label: status }

    return (
        <Badge variant={config.variant} className={
            status === "OPEN" ? "bg-blue-500 hover:bg-blue-600" :
                status === "IN_PROGRESS" ? "bg-yellow-500 hover:bg-yellow-600 text-black" :
                    status === "WAITING_FOR_CUSTOMER" ? "bg-orange-500 hover:bg-orange-600 text-white" :
                        status === "RESOLVED" ? "bg-green-500 hover:bg-green-600 text-white" :
                            status === "CLOSED" ? "bg-gray-500 hover:bg-gray-600" :
                                ""
        }>
            {config.label}
        </Badge>
    )
}
