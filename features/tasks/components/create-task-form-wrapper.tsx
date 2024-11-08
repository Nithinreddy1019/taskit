"use client"

import { useParams } from "next/navigation";



import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";



import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateTaskForm } from "./create-task-form";



interface CreateTaskFormWrapperProps {
    onCancel: () => void,
}


export const CreateTaskFormWrapper = ({
    onCancel,
}: CreateTaskFormWrapperProps) => {
    
    const params = useParams()
    // Add similar hook to get projectID

    const workspaceId = useWorkspaceId()

    const { data: projects, isLoading: isLoadingProjects} = useGetProjects({ workspaceId });
    const { data: members, isLoading: isLoadingMembers} = useGetMembers({ workspaceId });

    const isLoading = isLoadingProjects || isLoadingMembers;

    const projectOptions = projects?.map((project) => ({
        id: project.id,
        name: project.name,
        image: project.image
    }));

    const memberOptions = members?.map((member) => ({
        id: member.userId,
        name: member.name,
        image: member.image
    }));


    if(isLoading) {
        return (
            <Card className="w-full h-[600px] border-none shadow-none">
                <CardContent className="w-full p-4 space-y-4">
                    <Skeleton className="h-10 rounded-md mt-8"/>
                    
                    <Skeleton className="h-12 rounded-md"/>
                    
                    <Skeleton className="h-10 rounded-md"/>
                    <Skeleton className="h-16 w-2/3 rounded-md"/>
                    <Skeleton className="h-10 rounded-md"/>

                    <Skeleton className="h-8 w-[64px] rounded-md"/>
                </CardContent>
            </Card>
        )
    }
    
    return (
        <CreateTaskForm
            onCancel={onCancel} 
            projectOptions={projectOptions ?? []} 
            memberOptions={memberOptions ?? []}
        />
    )
}