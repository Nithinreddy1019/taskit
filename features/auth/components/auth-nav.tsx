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
        <div className="w-full flex items-center justify-between px-4 bg-neutral-100/60 dark:bg-black/70 rounded-xl p-4 sticky top-4 backdrop-blur-md">
            <Image 
                src={"./logo.svg"}
                alt="logo"
                height={50}
                width={50}
            />

            <Button
                onClick={hanldeNavigation}
            >
                {pathname.includes("sign-in") ? "Sign up" : "Sign in"}
            </Button>
        </div>
    )
}