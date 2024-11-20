import Image from "next/image"
import Link from "next/link"
import { Separator } from "../ui/separator"
import { Navigation } from "./navigation"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { Projects } from "./projects"


export const Sidebar = () => {
    return (
        <aside className="h-full w-full p-4 border-r">
            <Link href={"/home"} className="flex items-center gap-3">
                <Image 
                    src={"/logo.svg"}
                    alt="Logo"
                    height={40}
                    width={40}
                />
                <h2 className="text-2xl font-semibold mr-1 text-blue-500">
                    Task
                    <span className="text-blue-700 font-bold">It</span>
                </h2>
            </Link>

            <Separator className="my-4"/>

            <WorkspaceSwitcher />

            <div className="my-4"/>

            <Navigation />

            <Separator className="my-4"/>

            <Projects />
        </aside>
    )
}