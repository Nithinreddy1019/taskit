import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Image from "next/image"


interface MemberAvatarProps {
    imageUrl?: string,
    name: string,
    className?: string
}

export const MemberAvatar = ({
    imageUrl,
    name,
    className
}: MemberAvatarProps) => {
    if(imageUrl) {
        return (
            <div className={cn(
                "size-10 relative rounded-md overflow-hidden",
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
            "size-10 rounded-md",
            className,
        )}>
            <AvatarFallback className="text-white rounded-md bg-blue-700/80 font-semibold text-lg">
                {name[0]}
            </AvatarFallback>
        </Avatar>
    )
}