import { cn } from "@/lib/utils"
import { UserIcon } from "lucide-react"
import Image from "next/image"


interface UserAvatarProps {
    avatarUrl: string,
    size?: number,
    className?: string
}

export const UserAvatar = ({
    avatarUrl,
    size,
    className
}: UserAvatarProps) => {
    return (
        <>
            {avatarUrl && (
                <Image 
                    src={avatarUrl}
                    alt="avatar"
                    height={size || 40}
                    width={size || 40}
                    className={cn("aspect-square", className)}
                />
            )}

            {!avatarUrl && (
                <div className={cn("bg-secondary dark:bg-black rounded-full flex items-center justify-center size-10", className)}>
                    <UserIcon strokeWidth={1.25} className=""/>
                </div>
            )}
        </>
    )
}