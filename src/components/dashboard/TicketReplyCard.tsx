import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { hu } from "date-fns/locale"

interface TicketReplyCardProps {
    content: string
    userName: string | null
    userEmail?: string | null
    isStaffReply: boolean
    createdAt: Date
}

export function TicketReplyCard({ content, userName, isStaffReply, createdAt }: TicketReplyCardProps) {
    const initials = userName
        ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '??'

    return (
        <Card className={isStaffReply ? "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20" : ""}>
            <CardContent className="pt-6">
                <div className="flex gap-4">
                    <Avatar>
                        <AvatarFallback className={isStaffReply ? "bg-blue-500 text-white" : "bg-primary"}>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">
                                {userName || 'Ismeretlen felhasználó'}
                            </span>
                            {isStaffReply && (
                                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                    Support Team
                                </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: hu })}
                            </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{content}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
