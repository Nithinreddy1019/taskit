import { auth } from "@/auth";
import { MembersList } from "@/features/workspaces/components/members-list";
import { redirect } from "next/navigation";

const WorkspaceIdmembersPage = async () => {
    
    const session = await auth();
    if(!session?.user) {
        redirect("/sign-in")
    };
    
    return (
        <div className="w-full lg:max-w-xl">
            <MembersList />
        </div>
    )
};


export default WorkspaceIdmembersPage;