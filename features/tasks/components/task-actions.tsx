

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, Trash2Icon } from "lucide-react";


interface TaskActionsProps  {
    id: string,
    projectId: string,
    children: React.ReactNode,
}

export const TaskActions = ({
    id,
    projectId,
    children,
}: TaskActionsProps) => {

    return (
        <div className="flex justify-end">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                        onClick={() => {}}
                        disabled={false}
                        className="font-medium px-[10px] py-2"
                    >
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2"/>
                        Task details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {}}
                        disabled={false}
                        className="font-medium px-[10px] py-2"
                    >
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2"/>
                        Open project
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {}}
                        disabled={false}
                        className="font-medium px-[10px] py-2"
                    >
                        <PencilIcon className="size-4 mr-2 stroke-2"/>
                        Edit task
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {}}
                        disabled={false}
                        className="font-medium px-[10px] py-2 text-destructive focus:text-destructive"
                    >
                        <Trash2Icon className="size-4 mr-2 stroke-2"/>
                        Delete task
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}