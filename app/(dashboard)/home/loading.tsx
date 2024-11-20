import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react"


const HomeLoading = () => {
    return (
        <div className="h-full flex items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground"/>
        </div>
    )
}


export default HomeLoading;