import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { auth } from "@/auth";

import { createWorkspaceSchema } from "../schemas";
import { db } from "@/lib/db";
import { bucketName, generateSignedUrl, isValidFileSize, randomImageName, s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const app = new Hono()
    .get("/",
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized"}, 401)
            };

            const workspaces = await db.workspace.findMany({
                where: {
                    userId: session.user.id!
                }
            });

            const updatedWorkspaces = await Promise.all(workspaces.map(async (workspace) => {
                if(workspace.image === null) {
                    return {
                        ...workspace,
                        imageUrl: null
                    }
                }
                const imageUrl = await generateSignedUrl(workspace.image);
                return {
                    ...workspace,
                    imageUrl
                }
            }));

            return c.json({ data: updatedWorkspaces }, 200)
            
        }
    )
    .post(
        "/",
        zValidator("form", createWorkspaceSchema),
        async (c) => {

            const session = await auth();
            
            if(!session?.user) {
                return c.json({ error: "Unauthorized"}, 401)
            };
            
            const { name, image } = c.req.valid("form");

            let imageFileName = "";

            if(image instanceof File) {
                if(!isValidFileSize(image.size)) {
                    return c.json({ error: "Image too large" }, 413)
                };

                imageFileName = await randomImageName();
                const fileArrayBuffer = await image.arrayBuffer();
                const fileBuffer = Buffer.from(fileArrayBuffer);

                const params = {
                    Bucket: bucketName,
                    Key: imageFileName,
                    Body: fileBuffer,
                    ContentType: image.type 
                };

                const putCommand = new PutObjectCommand(params);
                const uploadResponse = await s3Client.send(putCommand);
            };
            

            try {
                const workspace = await db.workspace.create({
                    data: {
                        name,
                        userId: session.user?.id!,
                        image: imageFileName === "" ? null : imageFileName
                    }
                });

                return c.json({ data: workspace }, 200)
            } catch (error) {
                return c.json({ error: "Something went wrong"}, 500)
            }

        }
    )


export default app;