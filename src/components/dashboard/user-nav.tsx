"use client"

import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"

interface UserNavProps {
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
}

export function UserNav({ user }: UserNavProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden md:block">
                <div className="font-medium">{user?.name || 'Felhasználó'}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full cursor-pointer">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.name || 'Felhasználó'}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/login" })} className="cursor-pointer text-red-500 focus:text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Kijelentkezés</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
