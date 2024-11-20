"use client"

import { Loader2 } from "lucide-react";


const DashboardLoading = () => {
    return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="size-5 animate-spin"/>
        </div>
    )
}

export default DashboardLoading;