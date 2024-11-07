import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono"
import * as z from "zod";
import { auth } from "@/auth";


import { db } from "@/lib/db";
import { truncateByDomain } from "recharts/types/util/ChartUtils";
import { deleteFromBucket, generateSignedUrl, isValidFileSize, putImageInBucket, randomImageName } from "@/lib/s3";
import { createProjectSchema, updateProjectSchema } from "../schemas";


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
    .patch("/:projectId",
        zValidator("form", updateProjectSchema),
        async (c) => {
            const session = await auth();
            
            if(!session?.user) {
                return c.json({ error: "Unauthorized"}, 401)
            };

            const { projectId } = c.req.param();
            const { name, image } = c.req.valid("form");

            const existingProject = await db.projetcs.findUnique({
                where: {
                    id: projectId
                }
            });

            if(!existingProject) {
                return c.json({ error: "Project does not exist "}, 403);
            };


            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: existingProject?.workspaceId!
                    }
                }
            });

            if(!isMember) {
                return c.json({ error: "Unauthorized" }, 401)
            };

        

            if (image === "undefined" || image === "") {
                if(existingProject?.image !== null) {
                    const res = await deleteFromBucket(existingProject?.image!);
                }
                const updatedProject = await db.projetcs.update({
                    where: {
                        id: existingProject.id
                    },
                    data: {
                        name: name,
                        image: null,
                        updatedAt: new Date().toISOString()
                    }
                });
                return c.json({ data: updatedProject }, 200);
            } else if (typeof(image) === "string" && image !== "undefined") {
                const updatedProject = await db.projetcs.update({
                    where: {
                        id: existingProject.id
                    },
                    data: {
                        name: name,
                        updatedAt: new Date().toISOString()
                    }
                });
                return c.json({ data: updatedProject }, 200);
            }
            

            if(existingProject?.image !== null) {
                const res = await deleteFromBucket(existingProject?.image!);
            }

            const imageFileName = await randomImageName();
            const uploadRes = await putImageInBucket(image as File, imageFileName)
            if("error" in uploadRes) {
                return c.json({ error: "Image upload went wrong"}, 400)
            }

            const updatedProjectWithImage = await db.projetcs.update({
                where: {
                    id: existingProject.id
                },
                data: {
                    name: name,
                    image: imageFileName,
                    updatedAt: new Date().toISOString()
                }
            });

            return c.json({ data: updatedProjectWithImage }, 200);

        }
    )
    .delete("/:projectId",
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401);
            };

            const { projectId } = c.req.param();

            const existingProject = await db.projetcs.findUnique({
                where: {
                    id: projectId
                }
            });

            if(!existingProject) {
                return c.json({ error: "Project does not exist "}, 403);
            };


            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: existingProject.workspaceId
                    }
                }
            });

            if(!isMember) {
                return c.json({ error: "Unauthorized" }, 401)
            };

           
            

            // TODO:delete tasks associated with it
            await db.projetcs.delete({
                where: {
                    id: projectId
                }
            });

            return c.json({ data: { id: projectId }}, 200);

        }
    )


export default app;