"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"


export const AuthNav = () => {

    const pathname = usePathname();
    const router = useRouter();

    const hanldeNavigation = () => {
        if(pathname.includes("sign-in")) {
            router.push("/sign-up")
        } else {
            router.push("/sign-in")
        }
    }

    return (
        <div className="w-full flex items-center justify-between px-4">
            <Image 
                src={"./logo.svg"}
                alt="logo"
                height={50}
                width={50}
            />

            <Button
                size="sm"
                onClick={hanldeNavigation}
            >
                {pathname.includes("sign-in") ? "Sign up" : "Sign in"}
            </Button>
        </div>
    )
}