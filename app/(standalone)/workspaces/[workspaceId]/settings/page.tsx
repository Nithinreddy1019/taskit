import { auth } from "@/auth";
import { getWorkspaceAction } from "@/features/workspaces/actions/get-workspace-action";
import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form";
import { redirect } from "next/navigation";



interface WorksapceIdSettingsPageProps {
    params: {
        workspaceId: string
    }
};


const WorksapceIdSettingsPage = async ({
    params,
}: WorksapceIdSettingsPageProps) => {
    
    const session = await auth();
    
    const initialValues = await getWorkspaceAction({ workspaceId: params.workspaceId });

    if(!initialValues) {
        redirect(`/workspaces/${params.workspaceId}`)
    }

// Get imageURL
    return (
        <div className="w-full max-w-xl">
            <UpdateWorkspaceForm initialValues={initialValues}/>
        </div>
    );
}
 
export default WorksapceIdSettingsPage;