import { LoaderIcon } from "lucide-react"



export const PageLoader = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <LoaderIcon className="size-5 animate-spin text-muted-foreground"/>
        </div>
    )
}