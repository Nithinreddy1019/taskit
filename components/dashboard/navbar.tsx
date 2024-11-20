"use client"
import { usePathname } from "next/navigation"
import { MobileSidebar } from "./mobile-sidebar"
import { UserButton } from "./user-button"


    export const Navbar = () => {

        const pathname = usePathname();
        console.log(pathname)

        const navHeading = pathname.includes("/tasks") ? "All Tasks" : pathname.includes("/projects") ? "Project" : "Home";
        const navDesc = pathname.includes("/tasks") ? "Monitor all your tasks" : pathname.includes("/projects") ? "Monitor your project here" : "Monitor all your tasks and projects here.";

        return (
            <nav className="pt-4 px-6 flex items-center justify-between w-full">
                <div className="hidden lg:flex flex-col">
                    <h1 className="text-2xl font-semibold">{navHeading}</h1>
                    <p className="text-muted-foreground">{navDesc}</p>
                </div>

                <MobileSidebar />
                <UserButton />
            </nav>
        )
    }