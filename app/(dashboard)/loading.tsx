"use client"

import { Loader } from "lucide-react";


// WIP: Add better loading skeletons
const DashboardLoading = () => {
    return (
        <div className="h-screen flex items-center justify-center">
            <Loader className="size-5 animate-spin"/>
        </div>
    )
}

export default DashboardLoading;