import { Loader } from "lucide-react"


// WIP: Add shimmerUI when loading
const HomeLoading = () => {
    return (
        <div className="h-full flex items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground"/>
        </div>
    )
}


export default HomeLoading;