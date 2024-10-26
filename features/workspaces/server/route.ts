import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schemas";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const app = new Hono()
    .post(
        "/",
        zValidator("json", createWorkspaceSchema),
        async (c) => {

            const session = await auth();
            
            if(!session?.user) {
                return c.json({ error: "Unauthorized"}, 401)
            };

            const { name } = c.req.valid("json");

            try {
                const workspace = await db.workspace.create({
                    data: {
                        name,
                        userId: session.user.id!,
                    }
                });

                return c.json({
                    data: workspace
                }, 200)
            } catch (error) {
                return c.json({ error: "Somethign went wrong"}, 500)
            }

        }
    )


export default app;