import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Image from "next/image"


interface ProjectAvatarProps {
    imageUrl?: string,
    name: string,
    className?: string,
    fallbackclassname?: string
}

export const ProjectAvatar = ({
    imageUrl,
    name,
    className,
    fallbackclassname
}: ProjectAvatarProps) => {
    if(imageUrl) {
        return (
            <div className={cn(
                "size-6 relative rounded-md overflow-hidden",
                className,
            )}>
                <Image 
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                />
            </div>
        )
    }


    return (
        <Avatar className={cn(
            "size-6 rounded-md",
            className,
        )}>
            <AvatarFallback className={cn(
                "text-white rounded-md bg-blue-700/80 font-semibold text-sm",
                fallbackclassname
            )}>
                {name[0]}
            </AvatarFallback>
        </Avatar>
    )
}