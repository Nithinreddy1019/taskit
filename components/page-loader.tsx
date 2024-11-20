import { LoaderIcon } from "lucide-react"
import { Skeleton } from "./ui/skeleton"



export const PageLoader = () => {
    return (
        <div className="h-full space-y-4">
            <Skeleton className="w-full h-28"/>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <Skeleton className="w-full h-[450px]"/>
                <Skeleton className="w-full h-[350px]"/>
                <Skeleton className="w-full h-[300px]"/>
            </div>
        </div>
    )
}