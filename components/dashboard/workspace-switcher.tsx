"use client"

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { RiAddCircleFill } from "react-icons/ri";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";


export const WorkspaceSwitcher = () => {

    const router = useRouter();

    const workspaceId = useWorkspaceId();
    const { data: workspaces, isPending } = useGetWorkspaces();

    const onSelect = (id: string) => {
        router.push(`/workspaces/${id}`);
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500 font-medium">Workspaces</p>
                <RiAddCircleFill className="size-4 text-neutral-500 cursor-pointer hover:opacity-75 transition"/>
            </div>

            <Select onValueChange={onSelect} value={workspaceId}>
                <SelectTrigger className="w-full bg-neutral-200 dark:bg-black/30 font-medium p-1 focus:ring-0 ring-0 focus:outline-none border-none">
                    <SelectValue placeholder="No workspace selected" />
                </SelectTrigger>
                <SelectContent>
                    {workspaces?.map((workspace) => (
                        <SelectItem key={workspace.id} value={workspace.id}>
                            <div className="flex items-center justify-start gap-2 font-medium">
                                <WorkspaceAvatar 
                                    imageUrl={workspace.imageUrl === null ? undefined : workspace.imageUrl}
                                    name={workspace.name}
                                />
                                <p>{workspace.name}</p>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}