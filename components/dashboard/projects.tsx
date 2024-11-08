"use client"

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";


export const Projects = () => {

    const pathanme = usePathname();

    const { open } = useCreateProjectModal();
    const workspaceId = useWorkspaceId();
    const { data } = useGetProjects({ workspaceId });

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500 font-medium">Projects</p>
                <RiAddCircleFill
                    onClick={open} 
                    className="size-4 text-neutral-500 cursor-pointer hover:opacity-75 transition"
                />
            </div>
            <div>
                {data?.map((project) => {
                    const href = `/workspaces/${workspaceId}/projects/${project.id}`
                    const isActive = pathanme === `/workspaces/${workspaceId}/projects/${project.id}`

                    return (
                        <Link href={href} key={project.id}>
                            <div 
                                className={
                                    cn("flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                                        isActive && ("bg-white shadow-sm hover:opacity-100 text-primary dark:bg-black/50")
                                    )
                                }
                            >
                                <ProjectAvatar imageUrl={project.imageUrl!} name={project.name}/>
                                <span className="truncate">{project.name}</span>
                            </div>
                        </Link>
                    )
                    })}
            </div>
        </div>
    )
};