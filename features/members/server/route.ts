import { auth } from "@/auth";
import { MemberRole } from "@/features/workspaces/types";
import { db } from "@/lib/db";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";


const app = new Hono()
    .get("/",
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401)
            };

            const { workspaceId } = c.req.valid("query");

            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: workspaceId
                    }
                }
            });

            if (!isMember) {
                return c.json({ error: "Unauthorized" }, 401)
            };


            const members = await db.members.findMany({
                where: {
                    workspaceId : workspaceId
                },
                include: {
                    user: {
                        select: {
                            email: true,
                            name: true,
                            image: true,
                        }
                    },
                },
                orderBy: [
                    {
                        role: "asc"
                    },
                    {
                        user: {
                            name: "asc"
                        }
                    }
                ]
            });

            const updatedMembers = members.map((member) => (
                {
                    name: member.user.name,
                    email: member.user.email,
                    image: member.user.image,
                    userId: member.userId,
                    workspaceId: member.workspaceId,
                    role: member.role
                }
            ));

            return c.json({ data: updatedMembers }, 200);
        }
    )
    .delete("/:workspaceId/:userId",
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401)
            };

            const { workspaceId, userId } = c.req.param();

            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: workspaceId
                    }
                }
            });
            if (!isMember || isMember.role !== MemberRole.ADMIN) {
                return c.json({ error: "Unauthorized" }, 401);
            };


            const userToDeleteIsMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: userId,
                        workspaceId: workspaceId
                    }
                }
            });
            if(!userToDeleteIsMember) {
                return c.json({ error: "Not a member" }, 403);
            };
            if(userToDeleteIsMember.role !== MemberRole.MEMBER){
                return c.json({ error: "Unauthorized" }, 401);
            };


            const userDeleted = await db.members.delete({
                where: {
                    memberId: {
                        userId: userToDeleteIsMember.userId,
                        workspaceId: workspaceId
                    }
                }
            });

            return c.json({ data: {userId: userDeleted.userId }}, 200);

        }
    )
    .patch(
        "/:workspaceId/:userId",
        zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401)
            };

            const { workspaceId, userId } = c.req.param();
            const { role } = c.req.valid("json");

            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: workspaceId
                    }
                }
            });
            if (!isMember || isMember.role !== MemberRole.ADMIN) {
                return c.json({ error: "Unauthorized" }, 401);
            };


            const userToUpdateIsMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: userId,
                        workspaceId: workspaceId
                    }
                }
            });
            if(!userToUpdateIsMember) {
                return c.json({ error: "Not a member" }, 403);
            };
            

            const totalMembers = await db.members.count({
                where: {
                    workspaceId: workspaceId
                }
            });
            if(totalMembers === 1) {
                return c.json({ error: "Cannot downgrade the only member" }, 400);
            };

            const updatedMember = await db.members.update({
                where: {
                    memberId: {
                        userId: userToUpdateIsMember.userId,
                        workspaceId: workspaceId
                    }
                },
                data: {
                    role: role
                }
            });


            return c.json({ data: { userId: updatedMember.userId }}, 200);
             
        }
    )


export default app;