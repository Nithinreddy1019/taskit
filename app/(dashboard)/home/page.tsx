import { auth } from "@/auth";
import { getWorkspacesAction } from "@/features/workspaces/actions/get-workspaces-action";
import { redirect } from "next/navigation";


const HomePage = async () => {

    const session = await auth();
    if(!session) {
        redirect("/sign-in")
    };

    const { data } = await getWorkspacesAction();

    if(data?.length === 0) {
        redirect("workspace/create")
    } else {
        // WIP: Is this how it should be
        redirect(`/workspaces/${data?.[0].id}`)
    }

    return (
        <div className="">
            Home page
        </div>
    );
}
 
export default HomePage;