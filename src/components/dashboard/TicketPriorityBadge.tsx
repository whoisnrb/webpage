import { Badge } from "@/components/ui/badge"

interface TicketPriorityBadgeProps {
    priority: string
}

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
    const variants: Record<string, { label: string, className: string }> = {
        LOW: { label: "Alacsony", className: "bg-gray-500 hover:bg-gray-600" },
        MEDIUM: { label: "Közepes", className: "bg-blue-500 hover:bg-blue-600" },
        HIGH: { label: "Magas", className: "bg-orange-500 hover:bg-orange-600" },
        URGENT: { label: "Sürgős", className: "bg-red-500 hover:bg-red-600" }
    }

    const config = variants[priority] || { label: priority, className: "" }

    return (
        <Badge className={config.className}>
            {config.label}
        </Badge>
    )
}
