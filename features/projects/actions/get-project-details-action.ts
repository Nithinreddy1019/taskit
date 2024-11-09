"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateSignedUrl } from "@/lib/s3";
import { ProjectType } from "../types";

interface getProjectDetailsActionProps {
    projectId: string
}

export const getProjectDetailsAction = async ({
    projectId
}: getProjectDetailsActionProps) => {
    // You can also throw error here mate
    //     throw new Error("Somethign wen r")

    const session = await auth();

    if(!session?.user) {
        return null;
    };


    const project = await db.projetcs.findUnique({
        where: {
            id: projectId
        }
    });
    

    const isMember = await db.members.findUnique({
        where: {
            memberId: {
                userId: session.user.id!,
                workspaceId: project?.workspaceId!
            }
        }
    });

    if(!isMember) {
        return null
    };

    // if(project?.image !== null) {
    //     const imageUrl = await generateSignedUrl(project?.image!);
    //     const projectData: ProjectType = {
    //         id: project?.id!,
    //         name: project?.name!,
    //         image: imageUrl,
    //         createdAt: new Date(project?.createdAt!)
    //     }
    //     return projectData
    // }

    const projectData: ProjectType = {
        id: project?.id!,
        name: project?.name!,
        image: project?.image !== null ? await generateSignedUrl(project?.image!): null,
        createdAt: new Date(project?.createdAt!),
        workspaceId: project?.workspaceId!
    }

    return projectData;
}