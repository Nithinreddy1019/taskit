"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db";
import { generateSignedUrl } from "@/lib/s3";


interface getWorkspaceInfoActionProps {
    workspaceId: string
};

export const getWorkspaceInfoAction = async ({
    workspaceId
}: getWorkspaceInfoActionProps) => {

    const session = await auth();

    if(!session?.user) {
        return null;
    };


    const worksapce = await db.workspace.findUnique({
        where: {
            id: workspaceId
        }
    });

    if(worksapce !== null && worksapce?.image !== null) {
        const imageUrl = await generateSignedUrl(worksapce.image);
        return { name: worksapce.name, image: imageUrl }
    }

    return { name: worksapce?.name, image: worksapce?.image };

}