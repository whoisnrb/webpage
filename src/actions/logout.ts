"use server"

import { signOut } from "@/auth"

export const logout = async () => {
    console.log("Logout action called")
    await signOut({ redirectTo: "/login" })
}
