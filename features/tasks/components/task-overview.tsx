import { Button } from "@/components/ui/button";
import { TaskPriority, TaskStatus, TaskType } from "../types";
import { PencilIcon } from "lucide-react";
import { OverviewProperty } from "./overview-property";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { TaskStatusIcon } from "./task-status-icon";
import { TaskPriorityIcon } from "./task-priority-icon";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal";


interface TaskOverviewProps {
    task: TaskType
}



export const TaskOverview = ({
    task
}: TaskOverviewProps) => {

    const { open } = useUpdateTaskModal();

    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-muted rounded-md p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Overview</p>
                    <Button
                        size="sm"
                        variant="tertiary"
                        onClick={() => open(task.id)}
                    >
                        <PencilIcon className="size-4 "/>
                        Edit
                    </Button>
                </div>

                <div className="flex flex-col gap-y-4 mt-4">
                    <OverviewProperty label="Assignee">
                        <MemberAvatar name={task.assignee.name!} imageUrl={task.assignee.image!} className="size-5"/>
                        <p className="text-sm font-medium">{task.assignee.name}</p>
                    </OverviewProperty>

                    <OverviewProperty label="Due date">
                        <TaskDate value={task.dueDate as string} className="text-sm font-medium"/>
                    </OverviewProperty>

                    <OverviewProperty label="Status">
                        <TaskStatusIcon status={task.status as TaskStatus}/>
                    </OverviewProperty>

                    <OverviewProperty label="Priority">
                        {task.priority ? (
                            <TaskPriorityIcon priority={task.priority as TaskPriority}/>                            
                        ) : (
                            <p>No priority</p>
                        )}
                    </OverviewProperty>
                </div>
            </div>
        </div>
    )
}