import { TaskPriority } from "../types"
import { cn } from "@/lib/utils"


import { FiWind } from "react-icons/fi";
import { FaForward } from "react-icons/fa6";
import { FiAlertTriangle } from "react-icons/fi";
import { IoSkull } from "react-icons/io5";




interface TaskPriorityIconProps {
    priority: TaskPriority,
    className?: string,
    variant?: "default" | "icon"
}


export const TaskPriorityIcon = ({
    priority,
    className,
    variant = "default"
}: TaskPriorityIconProps) => {
    return (
        <div 
            className={cn(
                "flex items-center gap-x-2 rounded-md px-1.5 py-0.5", 
                variant === "icon" && "p-0 rounded-full",
                priority === TaskPriority.LOW && "bg-green-400/80 text-green-700",
                priority === TaskPriority.MEDIUM && "bg-yellow-400/50 text-yellow-500",
                priority === TaskPriority.HIGH && "bg-red-700/50 text-red-700",
                priority === TaskPriority.EMERGENCY && " text-red-800",
            )}
        >
            <div 
                className={cn(
                    "rounded-sm p-1",
                    priority === TaskPriority.LOW && "text-green-700",
                    priority === TaskPriority.MEDIUM && "text-yellow-400",
                    priority === TaskPriority.HIGH && "text-red-700",
                    priority === TaskPriority.EMERGENCY && "text-red-700",
                )}
            >  
                    {priority === TaskPriority.LOW && <FiWind className=""/>}
                    {priority === TaskPriority.MEDIUM && <FaForward className=""/> }
                    {priority === TaskPriority.HIGH && <FiAlertTriangle className=""/>}
                    {priority === TaskPriority.EMERGENCY && <IoSkull className=""/>}
            </div>
            <div
                className={cn(
                    "text-xs",
                    variant === "icon" && "hidden"
                )}
            >   
                    {priority === TaskPriority.LOW && <p>Low</p>}
                    {priority === TaskPriority.MEDIUM && <p>Medium</p>}
                    {priority === TaskPriority.HIGH && <p>High</p>}
                    {priority === TaskPriority.EMERGENCY && <p className="font-semibold">Emergency!</p>}
            </div>
        </div>
    )
}