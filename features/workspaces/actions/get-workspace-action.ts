"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db";
import { generateSignedUrl } from "@/lib/s3";


interface getWorkspaceActionProps {
    workspaceId: string
};

export const getWorkspaceAction = async ({
    workspaceId
}: getWorkspaceActionProps) => {

    const session = await auth();

    if(!session?.user) {
        return null;
    };

    const isMember = await db.members.findUnique({
        where: {
            memberId: {
                userId: session.user.id!,
                workspaceId: workspaceId
            }
        }
    });

    if(!isMember) {
        return null;
    };

    const worksapce = await db.workspace.findUnique({
        where: {
            id: workspaceId
        }
    });

    if(worksapce !== null && worksapce?.image !== null) {
        const imageUrl = await generateSignedUrl(worksapce.image);
        return { ...worksapce, image: imageUrl }
    }

    return worksapce;

}