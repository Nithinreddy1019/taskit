import { TaskStatus } from "../types"
import { cn } from "@/lib/utils"






interface TaskStatusIconProps {
    status: TaskStatus,
    className?: string,
    variant?: "default" | "icon"
}


export const TaskStatusIcon = ({
    status,
    className,
    variant = "default"
}: TaskStatusIconProps) => {
    return (
        <div 
            className={cn(
                "flex items-center gap-x-2 px-1.5 rounded-md my-1 w-fit", 
                variant === "icon" && "p-0 rounded-full",
                status === TaskStatus.BACKLOG && "bg-black/50 text-black dark:text-white/50",
                status === TaskStatus.TODO && "bg-orange-800/50 text-orange-800",
                status === TaskStatus.IN_PROGRESS && "bg-yellow-400/50 text-yellow-500",
                status === TaskStatus.IN_REVIEW && "bg-blue-700/50 text-blue-600",
                status === TaskStatus.DONE && "bg-green-400/80 text-green-700"
            )}
        >
            <div 
                className={cn(
                    "h-2 w-2 rounded-full",
                    status === TaskStatus.BACKLOG && "bg-black dark:bg-white/60",
                    status === TaskStatus.TODO && "bg-orange-800",
                    status === TaskStatus.IN_PROGRESS && "bg-yellow-400",
                    status === TaskStatus.IN_REVIEW && "bg-blue-700",
                    status === TaskStatus.DONE && "bg-green-700"
                )}
            >
            </div>
            <div
                className={cn(
                    "text-xs",
                    variant === "icon" && "hidden"
                )}
            >   
                    {status === TaskStatus.BACKLOG && <p>Backlog</p>}
                    {status === TaskStatus.TODO && <p>Todo</p>}
                    {status === TaskStatus.IN_PROGRESS && <p>In Progress</p>}
                    {status === TaskStatus.IN_REVIEW && <p>In Review</p>}
                    {status === TaskStatus.DONE && <p>Done</p>}
            </div>
        </div>
    )
}