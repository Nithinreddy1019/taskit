"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { MoreVertical, Undo2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";


import { MemberAvatar } from "@/features/members/components/member-avatar";
import { DottedSeparator } from "@/components/dotted-separator";
import { useWorkspaceId } from "../hooks/use-workspace-id"
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberRole } from "../types";
import { useConfirm } from "@/hooks/use-confirm";




export const MembersList = () => {
    
    const router = useRouter()
    
    const [ConfirmDialog, confirm] = useConfirm(
        "remove member",
        "This member will be removed from workspace",
        "destructive"
    );
    const workspaceId = useWorkspaceId();
    const { data, isPending } = useGetMembers({ workspaceId });
    const {
        mutate: deleteMember,
        isPending: isDeletingMember
    } = useDeleteMember();
    const {
        mutate: updateMember,
        isPending: isUpdatingMember
    } = useUpdateMember();


    const hanldeUpdateMember = async (workspaceId: string, userId: string, role: MemberRole) => {
        updateMember({
            json: { role },
            param: { workspaceId: workspaceId, userId: userId }
        })
    };


    const hanldeDeleteMember = async (workspaceId: string, userId: string) => {
        const ok = await confirm();
        if(!ok) return;

        deleteMember({
            param: { workspaceId, userId }
        }, {
            onSuccess: () => {
                console.log("deleted")
            }
        })
    };


    return (
        <Card className="w-full h-full border-none shadow-none">
            <ConfirmDialog />
            <CardHeader className="flex flex-row items-center justi gap-x-4 p-6 space-y-0">
                <CardTitle className="text-xl font-semibold">
                    Members List
                </CardTitle>
                <TooltipProvider>
                        <Tooltip delayDuration={1}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="px-1.5 py-0 h-[28px]"
                                    onClick={() => router.push(`/workspaces/${workspaceId}`)}
                                >
                                    <Undo2 className="size-4" strokeWidth={3}/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Go back</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
            </CardHeader>
            <div className="px-6">
                <DottedSeparator />
            </div>
            <CardContent className="p-6">
                {data?.map((member, index) => (
                    <Fragment key={member.userId}>
                        <div className="flex items-center gap-4">
                            <MemberAvatar 
                                //WIP: TODO Hanlde user image url issue
                                imageUrl={member.image!} 
                                name={member.name!}
                            />
                            <div className="flex flex-col">
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        className="ml-auto"
                                        variant="secondary"
                                        size="icon"
                                    >
                                        <MoreVertical className="size-4 text-muted-foreground"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" side="bottom">
                                    <DropdownMenuItem
                                        className="font-medium"
                                        onClick={() => hanldeUpdateMember(workspaceId, member.userId, MemberRole.ADMIN)}
                                        disabled={isUpdatingMember}
                                    >
                                        Set as Admin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="font-medium"
                                        onClick={() => hanldeUpdateMember(workspaceId, member.userId, MemberRole.MEMBER)}
                                        disabled={isUpdatingMember}
                                    >
                                        Set as Member
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="font-medium"
                                        onClick={() => hanldeDeleteMember(workspaceId, member.userId)}
                                        disabled={isDeletingMember}
                                    >
                                        <X className="size-4"/>
                                        Remove {member.name}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {index < data.length - 1 && (
                            <Separator className="my-3"/>
                        )}
                    </Fragment>
                ))}
            </CardContent>
        </Card>
    )
}