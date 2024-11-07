"use client"

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const DashboardError = () => {
    return (
        <div className="h-screen">
            <div className="mt-8 lg:mt-24 flex items-center justify-center">
                <div className="flex flex-col items-center gap-y-4">
                    <AlertTriangle className="text-muted-foreground size-8"/>
                    <p className="text-lg text-muted-foreground">Something went wrong</p>
                    <Button
                        asChild
                        size="sm"
                        variant="outline"
                    >
                        <Link href={"/home"}>
                            Go Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}


export default DashboardError;