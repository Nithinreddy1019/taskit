import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono"
import * as z from "zod";
import { auth } from "@/auth";


import { db } from "@/lib/db";
import { truncateByDomain } from "recharts/types/util/ChartUtils";
import { generateSignedUrl, isValidFileSize, putImageInBucket, randomImageName } from "@/lib/s3";
import { createProjectSchema } from "../schemas";


const app = new Hono()
    .get(
        "/",
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401);
            };

            const { workspaceId } = c.req.valid("query");

            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session?.user.id!,
                        workspaceId: workspaceId
                    }
                }
            });

            if(!isMember) {
                return c.json({ error: "Unauthorized" }, 401);
            };


            const projects = await db.projetcs.findMany({
                where: {
                    workspaceId: workspaceId
                },
                select: {
                    id: true,
                    name: true,
                    image: true,
                    workspaceId: true,
                    createdAt: true
                }
            });


            const updatedProjectsList = await Promise.all(projects.map(async (project) => {
                if(project.image === null) {
                    return {
                        ...project,
                        imageUrl: null
                    }
                };
                const imageUrl = await generateSignedUrl(project.image);
                return {
                    ...project,
                    imageUrl
                }
            }));

            return c.json({ data: updatedProjectsList }, 200);

        }
    )
    .post("/",
        zValidator("form", createProjectSchema),
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401);
            };

            const { name, image, workspaceId } = c.req.valid("form");

            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: workspaceId
                    }
                }
            });

            if(!isMember) {
                return c.json({ error: "Unauthorized"}, 401)
            };

            let imageFileName = "";
            if(image instanceof File) {
                if(!isValidFileSize(image.size)) {
                    return c.json({ error: "Image too large" }, 413)
                };
                imageFileName = await randomImageName();
                const res = putImageInBucket(image, imageFileName);
            };

            const project = await db.projetcs.create({
                data: {
                    name: name,
                    image: imageFileName === "" ? null : imageFileName,
                    createdBy: session.user.id!,
                    workspaceId: workspaceId
                }
            });

            return c.json({ data: project }, 200)

        }
    )


export default app;