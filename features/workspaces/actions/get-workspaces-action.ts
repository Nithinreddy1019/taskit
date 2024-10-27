"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db";

export const getWorkspacesAction = async () => {

    const session = await auth();

    if(!session?.user) {
        return { error: "Unauthorized" }
    };

    const workspacsList = await db.members.findMany({
        where: {
            userId: session.user?.id!
        },
        select: {
            workspace: {
                select: {
                    id: true,
                    name: true,
                    userId: true,
                    image: true
                }
            }
        }
    });

    const workspaces = workspacsList.map((item) => item.workspace);

    return { data: workspaces };

}