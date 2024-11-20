import { enumToDisplayText } from "@/lib/utils";
import { TaskStatus } from "../types"
import { CircleCheckIcon, CircleDashedIcon, CircleDotDashedIcon, CircleDotIcon, CircleIcon, PlusCircleIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";


interface KanbanColumnHeaderProps {
    board: TaskStatus;
    taskCount: number;
};


const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    [TaskStatus.BACKLOG] : (<CircleDashedIcon className="size-4 text-black"/>),
    [TaskStatus.TODO] : (<CircleIcon className="size-4 text-red-500"/>),
    [TaskStatus.IN_PROGRESS] : (<CircleDotDashedIcon className="size-4 text-yellow-500"/>),
    [TaskStatus.IN_REVIEW] : (<CircleDotIcon className="size-4 text-blue-500"/>),
    [TaskStatus.DONE] : (<CircleCheckIcon className="size-4 text-emerald-500"/>),
}

export const KanbanColumnHeader = ({
    board,
    taskCount
}: KanbanColumnHeaderProps) => {

    const icon = statusIconMap[board];
    const { open } = useCreateTaskModal();

    return (
        <div className="px-2 py-1 flex items-center justify-between w-full">
            <div className="flex items-center gap-x-2">
                {icon}
                <h2 className="text-sm font-medium">
                    {enumToDisplayText(board)}
                </h2>
                <div className="size-4 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
                    {taskCount}
                </div>
            </div>
            <Button
                onClick={() => open({status: board})}
                variant="ghost"
                size="icon"
                className="size-5"
            >
                <PlusIcon className="size-4 text-neutral-500"/>
            </Button>
        </div>
    )
}