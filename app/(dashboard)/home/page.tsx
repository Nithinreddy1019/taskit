import { auth } from "@/auth";
import { getWorkspacesAction } from "@/features/workspaces/actions/get-workspaces-action";
import { redirect } from "next/navigation";

const HomePage = async () => {
    const session = await auth();
    if (!session) {
        redirect("/sign-in");
    }

    const { data } = await getWorkspacesAction();
    
    if (data?.length === 0) {
        redirect("workspaces/create");
    } else {
        redirect(`/workspaces/${data?.[0].id}`);
    }
}

export default HomePage;