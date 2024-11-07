import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { getProjectDetailsAction } from "@/features/projects/actions/get-project-details-action";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { formatDateFromIso } from "@/lib/utils";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";


interface ProjectIdPageProps {
    params : {
        projectId: string
    }
};


const ProjectIdPage = async ({
    params
}: ProjectIdPageProps) => {

    const session = await auth();
    if(!session?.user) {
        redirect("/sign-in")
    };

    const initialValues  = await getProjectDetailsAction({ projectId: params.projectId});

    if(initialValues === null) {
        throw new Error("Somethign wen r")
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
                            {formatDateFromIso(JSON.stringify(initialValues?.createdAt!))}
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
        </div>
    )
}


export default ProjectIdPage;