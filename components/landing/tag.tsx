import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"




export const Tag = (props: HTMLAttributes<HTMLDivElement>) => {
    
    const { className, children , ...otherProps } = props;
    
    return (
        <div className={cn(
            "inline-flex border border-blue-400 gap-1.5 text-blue-400 px-2 py-0.5 rounded-xl uppercase items-center",
            className
        )}>
            <span>&#10038;</span>
            <span className="text-sm font-semibold">{children}</span>
        </div>
    )
}