import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskType } from "../types";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ChevronRightIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";


interface TaskBreadcrumbsProps {
    project: TaskType["project"],
    task: TaskType
}


export const TaskBreadcrumbs = ({
    project,
    task
}: TaskBreadcrumbsProps) => {

    const workspaceId = useWorkspaceId();
    const router = useRouter();

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "This action is permanent",
        "destructive"
    );
    const { mutate, isPending } = useDeleteTask();


    const handleDeleteTask = async () => {
        const ok = await confirm();
        if(!ok) return ;

        mutate({ param: { taskId: task.id }}, {
            onSuccess: () => {
                router.push(`/workspaces/${workspaceId}/tasks`);
            }
        })
    }

    return (
        <div className="flex items-center gap-x-2">
            <ConfirmDialog />
            <ProjectAvatar 
                name={project.name}
                imageUrl={project.image!}
                className="size-5"
            />
            <Link href={`/workspaces/${workspaceId}/projects/${project.id}`}>
                <p className="text-sm font-semibold  text-muted-foreground hover:opacity-80 transition">{project.name}</p>
            </Link>

            <ChevronRightIcon className="size-4 text-muted-foreground"/>

            <p className="text-sm font-semibold text-muted-foreground">
                {task.name}
            </p>

            <Button
                onClick={handleDeleteTask}
                variant="destructive"
                size="sm"
                className="ml-auto"
                disabled={isPending}
            >
                <Trash2Icon className="size-4 lg:mr-2 "/>
                <p className="hidden lg:block">Delete task</p>
            </Button>
        </div>
    )
}