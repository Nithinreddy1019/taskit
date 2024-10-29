import { auth } from "@/auth";
import { getWorkspaceInfoAction } from "@/features/workspaces/actions/get-workspace-info-action";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { redirect } from "next/navigation";

interface WorksapceJoinPageProps {
    params: {
        workspaceId: string,
        invitecode: string
    }
};

const WorkspaceJoinPage = async ({
    params
}: WorksapceJoinPageProps) => {
    
    const session = await auth();
    if(!session?.user) redirect("/sign-in");
    
    const responseData = await getWorkspaceInfoAction({
        workspaceId: params.workspaceId
    });

    if(!responseData) redirect("/home");

    const initialValues = {
        name: responseData.name as string,
        imageUrl: responseData.image !== null ? responseData.image : null
    }

    return (
        <div className="w-full lg:max-w-xl mt-4">
            <JoinWorkspaceForm initialValues={initialValues}/>
        </div>
    );
}
 
export default WorkspaceJoinPage;