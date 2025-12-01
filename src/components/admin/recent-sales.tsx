import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export function RecentSales() {
    return (
        <div className="space-y-8">
            <div className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Kovács Péter</p>
                    <p className="text-sm text-muted-foreground">
                        peter.kovacs@email.com
                    </p>
                </div>
                <div className="ml-auto font-medium">+19,990 Ft</div>
            </div>
            <div className="flex items-center">
                <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                    <AvatarImage src="/avatars/02.png" alt="Avatar" />
                    <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Nagy Anna</p>
                    <p className="text-sm text-muted-foreground">anna.nagy@email.com</p>
                </div>
                <div className="ml-auto font-medium">+39,990 Ft</div>
            </div>
            <div className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatars/03.png" alt="Avatar" />
                    <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Szabó Gábor</p>
                    <p className="text-sm text-muted-foreground">
                        gabor.szabo@email.com
                    </p>
                </div>
                <div className="ml-auto font-medium">+299,990 Ft</div>
            </div>
            <div className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatars/04.png" alt="Avatar" />
                    <AvatarFallback>WK</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Varga Éva</p>
                    <p className="text-sm text-muted-foreground">eva.varga@email.com</p>
                </div>
                <div className="ml-auto font-medium">+99,990 Ft</div>
            </div>
            <div className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatars/05.png" alt="Avatar" />
                    <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Tóth István</p>
                    <p className="text-sm text-muted-foreground">istvan.toth@email.com</p>
                </div>
                <div className="ml-auto font-medium">+39,990 Ft</div>
            </div>
        </div>
    )
}
