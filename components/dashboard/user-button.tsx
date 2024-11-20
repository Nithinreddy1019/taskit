"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { UserAvatar } from "./user-avatar"
import { CheckIcon, LogOutIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";




export const UserButton = () => {

   const { data } = useSession();
   const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="rounded-full">
                    <UserAvatar avatarUrl={data?.user?.image as string} size={40}/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="w-60 h-24 flex flex-col gap-2 items-center justify-center p-2">
                    <UserAvatar avatarUrl={data?.user?.image as string} size={60}/>
                    <p className="font-semibold">{data?.user?.name as string}</p>
                </div>
                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <MonitorIcon className="size-5 mr-2"/>
                        Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                <MonitorIcon className="size-5 mr-2"/>
                                System default
                                {theme === "system" && (<CheckIcon className="size-4 ml-2"/>)}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                <SunIcon className="size-5 mr-2"/>
                                Light
                                {theme === "light" && (<CheckIcon className="size-4 ml-2"/>)}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <MoonIcon className="size-5 mr-2"/>
                                Dark
                                {theme === "dark" && (<CheckIcon className="size-4 ml-2"/>)}
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {{
                        signOut()
                    }}}
                >
                    <LogOutIcon className="size-5 mr-2"/>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}