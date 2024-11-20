import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { WorkspaceIdClient } from "./client";


const WorkspaceIdPage = async () => {

    const session = await auth();
    if(!session?.user) {
        redirect("/sign-in");
    }

    return (
        <WorkspaceIdClient />
    );
}
 
export default WorkspaceIdPage;