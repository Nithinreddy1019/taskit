import { MoreHorizontalIcon } from "lucide-react"
import { TaskPriority, TaskType } from "../types"
import { TaskActions } from "./task-actions"
import { TaskDate } from "./task-date"
import { Separator } from "@/components/ui/separator"
import { MemberAvatar } from "@/features/members/components/member-avatar"
import { ProjectAvatar } from "@/features/projects/components/project-avatar"
import { TaskPriorityIcon } from "./task-priority-icon"



interface KanbanCardProps {
    task: TaskType
}


export const KanbanCard = ({
    task
}: KanbanCardProps) => {
    return (
        <div className="bg-white dark:bg-black p-2 mb-1.5 mx-1.5 rounded-md shadow-sm space-y-1.5">
            <div className="flex items-center justify-between gap-x-2 group">
                <div className="flex flex-col">
                    <p className="text-sm line-clamp-2">{task.name}</p>
                    <TaskDate value={task.dueDate as string} className="text-[10px]"/>
                </div>
                
                <TaskActions id={task.id} projectId={task.projectId}>
                    <MoreHorizontalIcon className="size-4 stroke-1 shrink-0 cursor-pointer"/>
                </TaskActions>
            </div>
            <Separator />
            {task.priority && (
                <div className="mt-1 flex items-center">
                    <div className="flex flex-col items-start gap-1.5">
                        <TaskPriorityIcon priority={task.priority as TaskPriority}/>
                    </div>
                </div>
            )}
            
            <div className="py-1 space-y-1.5">
                <div className="flex items-center gap-x-1.5">
                    <MemberAvatar name={task.assignee.name!} imageUrl={task.assignee.image!} className="size-6"/>
                    <p className="text-sm">{task.assignee.name}</p>
                </div>
                <div className="flex items-center gap-x-1.5">
                    <ProjectAvatar name={task.project.name} imageUrl={task.project.image!}/>
                    <p className="text-sm">{task.project.name}</p>
                </div>
            </div>
        </div>
    )
}