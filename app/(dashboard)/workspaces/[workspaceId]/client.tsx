"use client"

import { Analytics } from "@/components/analytics";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectType } from "@/features/projects/types";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { TaskType } from "@/features/tasks/types";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { MemberRole } from "@/features/workspaces/types";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";



export const WorkspaceIdClient = () => {

    const workspaceId = useWorkspaceId();

    const { data: analytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalytics({workspaceId});
    const { data: tasks, isLoading: isLoadingtasks } = useGetTasks({  
        workspaceId: workspaceId, 
        projectId: null,
        assigneeId: null,
        status: null,
        priority: null,
        search: null,
        dueDate: null
    });
    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({workspaceId});
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({workspaceId});
    

    
    

    const isLoading = 
        isLoadingAnalytics ||
        isLoadingMembers || 
        isLoadingProjects ||
        isLoadingtasks;

    if(isLoading) {
        return (
            <PageLoader />
        )
    };

    if(!analytics || !tasks || !projects || !members) {
        return <PageError message="failed to load workspace data"/>
    };



    return (
        <div className="h-full flex flex-col space-y-4">
            <Analytics data={analytics}/>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <TaskList data={tasks} total={tasks.length}/>
                <ProjectList data={projects} total={ projects.length}/>
                <MembersList data={members} total={members.length}/>
            </div>
        </div>
    )
};








interface TaskListProps {
    data: TaskType[],
    total: number,
}

export const TaskList = ({
    data,
    total
}: TaskListProps) => {
    
    const workspaceId = useWorkspaceId();
    const {open: createTask} = useCreateTaskModal();


    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Tasks {total}
                    </p>
                    <Button
                        variant="muted"
                        size="icon"
                        onClick={createTask}
                    >
                        <PlusIcon className="size-4"/>
                    </Button>
                </div>

                <Separator className="my-4 dark:bg-neutral-500"/>

                <ScrollArea>
                <ul className="flex flex-col gap-y-2 max-h-72">
                    {data.map((task) => (
                        <li key={task.id}>
                            <Link href={`/workspaces/${workspaceId}/tasks/${task.id}`}>
                                <Card className="shadow-none border-none rounded-lg hover:opacity-80 transition">
                                    <CardContent className="p-3">
                                        <p className="font-medium truncate">{task.name}</p>
                                        <div className="flex items-center gap-x-2">
                                            <p className="text-sm">{task.project.name}</p>
                                            <div className="size-1 rounded-full bg-neutral-300"/>
                                            <div className="text-sm text-muted-foreground flex items-center">
                                                <CalendarIcon className="size-3 mr-1"/>
                                                <span className="truncate">
                                                    {formatDistanceToNow(new Date(task.dueDate))}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
                        No tasks found
                    </li>
                </ul>
                <ScrollBar />
                </ScrollArea>

                <Button
                    variant="muted"
                    className="mt-4 w-full"
                    asChild
                >
                    <Link href={`/workspaces/${workspaceId}/tasks`}>
                        Show all
                    </Link>
                </Button>
            </div>
        </div>  
    )
}






interface ProjectListProps {
    data: {
        imageUrl: string | null;
        workspaceId: string;
        id: string;
        name: string;
        image: string | null;
        createdAt: string;
    }[],
    total: number,
}

export const ProjectList = ({
    data,
    total
}: ProjectListProps) => {
    
    const workspaceId = useWorkspaceId();
    const {open: createProject} = useCreateProjectModal();


    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-secondary rounded-lg p-3">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Projects - {total}
                    </p>
                    <Button
                        variant="muted"
                        size="icon"
                        onClick={createProject}
                    >
                        <PlusIcon className="size-4"/>
                    </Button>
                </div>

                <Separator className="my-4 dark:bg-neutral-500"/>

                <ScrollArea>
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-72">
                    {data.map((project) => (
                        <li key={project.id}>
                            <Link href={`/workspaces/${workspaceId}/projects/${project.id}`}>
                                <Card className="shadow-none border-none rounded-lg hover:opacity-80 transition">
                                    <CardContent className="p-2 flex items-center gap-x-2">
                                        <ProjectAvatar name={project.name} imageUrl={project.imageUrl!} className="size-8" fallbackclassname="text-lg"/>
                                        <p className=" font-medium truncate">{project.name}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
                        No projects found
                    </li>
                </ul>
                <ScrollBar />
                </ScrollArea>
            </div>
        </div>  
    )
}


interface MembersListProps {
    data: {
        name: string | null;
        email: string;
        image: string | null;
        userId: string;
        workspaceId: string;
        role: "ADMIN" | "MEMBER";
    }[],
    total: number
}


export const MembersList = ({
    data,
    total
}: MembersListProps) => {
    
    const workspaceId = useWorkspaceId();
    const {open: createProject} = useCreateProjectModal();

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    }


    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-secondary rounded-lg p-3">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Members - {total}
                    </p>
                    <Button
                        variant="muted"
                        size="icon"
                        asChild
                    >
                        <Link href={`/workspaces/${workspaceId}/members`}>
                            <SettingsIcon className="size-4"/>
                        </Link>
                    </Button>
                </div>

                <Separator className="my-4 dark:bg-neutral-500"/>

                <ScrollArea>
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-72">
                    {data.map((member) => (
                        <li key={member.userId}>
                                <Card className="shadow-none border-none rounded-lg overflow-hidden">
                                    <CardContent className="p-2 flex flex-cols items-center gap-x-2">
                                        <MemberAvatar name={member.name!} imageUrl={member.image!} className="size-10 text-lg"/>
                                        <div className="flex flex-col items-start overflow-hidden tracking-tight cursor-pointer" onClick={() => handleCopy(member.email)}>
                                            <p className="text-lg font-medium line-clamp-1">{member.name}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{member.email}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                        </li>
                    ))}
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
                        No members found
                    </li>
                </ul>
                <ScrollBar />
                </ScrollArea>
            </div>
        </div>  
    )
}