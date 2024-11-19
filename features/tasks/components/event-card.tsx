import { cn } from "@/lib/utils";
import { TaskPriority, TaskStatus } from "../types";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskPriorityIcon } from "./task-priority-icon";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useRouter } from "next/navigation";

interface EventCardProps {
    title: string,
    assignee: any,
    project: any,
    id: string,
    status: TaskStatus,
    priority: TaskPriority
};

const statusColorMap: Record<TaskStatus, string> = {
    [TaskStatus.BACKLOG]: "dark:border-l-neutral-500/50 border-l-black",
    [TaskStatus.TODO] : "border-l-red-500",
    [TaskStatus.IN_PROGRESS] : "border-l-yellow-500",
    [TaskStatus.IN_REVIEW] : "border-l-blue-500",
    [TaskStatus.DONE] : "border-l-emerald-500",
};

export const EventCard = ({
    title,
    assignee,
    project,
    id,
    status,
    priority
}: EventCardProps) => {

    const workspaceId = useWorkspaceId();
    const router = useRouter();


    const onClick = (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.stopPropagation();

        router.push(`/workspaces/${workspaceId}/tasks/${id}`);
    }

    return (
        <div className="px-1.5">
            <div
                onClick={onClick} 
                className={cn(
                "p-1.5 text-xs bg-white dark:bg-black/50 border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-80 transition",
                statusColorMap[status]
            )}>
                <p>{title}</p>
                <div className="flex items-center gap-x-1">
                    <MemberAvatar imageUrl={assignee.image} name={assignee.name} className="size-4"/>
                    <div className="h-1 w-1 rounded-full bg-neutral-600">
                    </div>
                    <ProjectAvatar imageUrl={project.image} name={project.name} className="size-4"/>
                    <div className="h-1 w-1 rounded-full bg-neutral-600">
                    </div>
                    <TaskPriorityIcon priority={priority} variant="icon"/>
                </div>
            </div>
        </div>
    )
}