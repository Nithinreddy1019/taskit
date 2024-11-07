import { auth } from "@/auth";
import { getProjectDetailsAction } from "@/features/projects/actions/get-project-details-action";
import { UpdateProjectForm } from "@/features/projects/components/update-project-form";
import { redirect } from "next/navigation";



interface ProjectIdSettingsPageProps {
    params: {
        projectId: string
    }
};


const ProjectIdSettingsPage = async ({
    params
}: ProjectIdSettingsPageProps) => {

    const session = await auth();
    if(!session?.user) {
        redirect("/sign-in")
    }

    const initialValues = await getProjectDetailsAction({ projectId: params.projectId});

    if(initialValues === null) {
        throw new Error("Fetching went wrong")
    };

    return (
        <div className="w-full lg: max-w-xl">
            <UpdateProjectForm initialValues={initialValues}/>
        </div>
    )
};


export default ProjectIdSettingsPage;