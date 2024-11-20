"use client"

import { Analytics } from "@/components/analytics";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { formatDateFromIso } from "@/lib/utils";
import { Pencil } from "lucide-react";
import Link from "next/link";

export const ProjectIdClient = () => {

    const projectId = useProjectId();
    const {data:initialValues, isLoading: isLoadingProject} = useGetProject({ projectId });
    const { data: analytics, isLoading: isLoadignAnalytics } = useGetProjectAnalytics({projectId});

    const isLoading = isLoadignAnalytics || isLoadingProject;

    if(isLoading) {
        return <PageLoader />
    };

    if(!initialValues) {
        return <PageError message="Task not found"/>
    }


    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <ProjectAvatar 
                        name={initialValues?.name!}
                        imageUrl={initialValues?.image!}
                        className="size-12"
                        fallbackclassname="text-xl"
                    />
                    <div>
                        <p className="text-lg font-medium">{initialValues?.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatDateFromIso(JSON.stringify(initialValues?.createdAt as string))}
                        </p>
                    </div>
                </div>

                <div>
                    <Button
                        asChild
                        size="sm"
                        variant="secondary"
                    >
                        <Link href={`/workspaces/${initialValues?.workspaceId!}/projects/${initialValues?.id}/settings`}>
                            <Pencil className="size-2"/>
                            Edit
                        </Link>
                    </Button>
                </div>
            </div>
            {analytics ? (
                <Analytics data={analytics}/>
            ): (
                null
            )}
            <TaskViewSwitcher hideProjectFilter/>

        </div>
    )
}