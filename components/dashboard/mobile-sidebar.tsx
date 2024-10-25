"use client"

import { PanelLeft, PanelRight } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Sidebar } from "./sidebar"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"


export const MobileSidebar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    return (
        <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant={"secondary"}
                    className="lg:hidden"
                    size="icon"
                >
                    <PanelLeft className="size-5 text-neutral-700"/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0" Icon={PanelRight}>
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}