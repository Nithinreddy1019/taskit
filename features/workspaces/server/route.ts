import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { auth } from "@/auth";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { db } from "@/lib/db";
import { deleteFromBucket, generateSignedUrl, isValidFileSize, putImageInBucket, randomImageName, s3Client } from "@/lib/s3";
import { MemberRole } from "../types";
import { generateInviteCode } from "@/lib/utils";
import { z } from "zod";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
    .get("/",
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized"}, 401)
            };

            // Query to find all workspaces user belongs to
            const newList = await db.members.findMany({
                where: {
                    userId: session.user?.id!
                },
                select: {
                    workspace: {
                        select: {
                            id: true,
                            name: true,
                            userId: true,
                            image: true,
                            inviteCode: true
                        }
                    }
                }
            });

            const workspaces = newList.map((item) => item.workspace);

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

                const res = putImageInBucket(image, imageFileName);
            };
            

            try {

                const workspace = await db.$transaction(async (tx) => {

                    const workspaceCreated = await tx.workspace.create({
                        data: {
                            name,
                            userId: session.user?.id!,
                            image: imageFileName === "" ? null : imageFileName,
                            inviteCode: generateInviteCode(6)
                        }
                    });

                    const member = await tx.members.create({
                        data: {
                            userId: session.user?.id!,
                            workspaceId: workspaceCreated.id,
                            role: MemberRole.ADMIN
                        }
                    });

                    return workspaceCreated;
                })

                return c.json({ data: workspace }, 200)
            } catch (error) {
                return c.json({ error: "Something went wrong"}, 500)
            }

        }
    )
    .patch("/:workspaceId",
        zValidator("form", updateWorkspaceSchema),
        async (c) => {
            const session = await auth();
            
            if(!session?.user) {
                return c.json({ error: "Unauthorized"}, 401)
            };

            const { workspaceId } = c.req.param();
            const { name, image } = c.req.valid("form");


            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: workspaceId
                    }
                }
            });

            if(!isMember || isMember.role !== MemberRole.ADMIN) {
                return c.json({ error: "Unauthorized" }, 401)
            };

            
            const worksapce = await db.workspace.findUnique({
                where: {
                    id: workspaceId,
                    userId: session.user.id!
                }
            });
        
            if (image === "undefined" || image === "") {
                if(worksapce?.image !== null) {
                    const res = await deleteFromBucket(worksapce?.image!);
                }
                const updatedWorkspace = await db.workspace.update({
                    where: {
                        id: workspaceId
                    },
                    data: {
                        name: name,
                        image: null
                    }
                });
                return c.json({ data: updatedWorkspace }, 200);
            } else if (typeof(image) === "string" && image !== "undefined") {
                const updatedWorkspace = await db.workspace.update({
                    where: {
                        id: workspaceId
                    },
                    data: {
                        name: name,
                    }
                });
                return c.json({ data: updatedWorkspace }, 200);
            }
            

            if(worksapce?.image !== null) {
                const res = await deleteFromBucket(worksapce?.image!);
            }

            const imageFileName = await randomImageName();
            const uploadRes = await putImageInBucket(image as File, imageFileName)
            if("error" in uploadRes) {
                return c.json({ error: "Image upload went wrong"}, 400)
            }

            const updatedWorkspaceWithImage = await db.workspace.update({
                where: {
                    id: workspaceId
                },
                data: {
                    name: name,
                    image: imageFileName
                }
            });

            return c.json({ data: updatedWorkspaceWithImage }, 200);

        }
    )
    .delete("/:workspaceId", 
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401);
            };

            const { workspaceId } = c.req.param();

            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: workspaceId
                    }
                }
            });

            if(!isMember || isMember.role !== MemberRole.ADMIN) {
                return c.json({ error: "Unauthorized" }, 401)
            };

            const workspaceExists = await db.workspace.findUnique({
                where: {
                    id: workspaceId
                }
            });
            if(workspaceExists && workspaceExists.image !== null) {
                await deleteFromBucket(workspaceExists?.image!);
            }

            // TODO: Delete members, tasks and projects associated with it
            await db.workspace.delete({
                where: {
                    id: workspaceId
                }
            });

            return c.json({ data: { id: workspaceId }}, 200);

        }
    )
    .post("/:workspaceId/reset-invite-code",
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401);
            };

            const { workspaceId } = c.req.param();

            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: workspaceId
                    }
                }
            });

            if(!isMember || isMember.role !== MemberRole.ADMIN) {
                return c.json({ error: "Unauthorized" }, 401)
            };

            const newCode = await generateInviteCode(6);

            const updatedWorkspace = await db.workspace.update({
                where: {
                    id: workspaceId
                },
                data: {
                    inviteCode: newCode
                }
            });

            return c.json({ data: updatedWorkspace }, 200)

        }
    )
    .post (
        "/:workspaceId/join",
        zValidator("json", z.object({ code: z.string() })),
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401);
            };

            const { workspaceId } = c.req.param();
            const { code } = c.req.valid("json");

            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: workspaceId
                    }
                }
            });

            if(isMember) {
                return c.json({ error: "Already a member" }, 409);
            };

            const workspace = await db.workspace.findUnique({
                where: {
                    id: workspaceId
                }
            });

            if(workspace?.inviteCode !== code) {
                return c.json({ error: "Incorrect invite code"}, 409)
            };

            await db.members.create({
                data: {
                    userId: session.user.id!,
                    workspaceId: workspaceId
                }
            });

            return c.json({ data: workspace }, 200);
        }
    )
    .get("/:workspaceId/analytics",
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401);
            };

            const { workspaceId } = c.req.param();

            

            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: workspaceId!
                    }
                }
            });
            if(!isMember) {
                return c.json({ error: "Unauthorized" }, 401)
            };

            const now = new Date();
            const thisMonthStart = startOfMonth(now);
            const thisMonthEnd = endOfMonth(now);
            const lastMonthStart = startOfMonth(subMonths(now, 1));
            const lastMonthEnd = endOfMonth(subMonths(now, 1));

            const thisMonthTasks = await db.tasks.findMany({
                where: {
                    workspaceId: workspaceId,
                    dueDate: {
                        gte: thisMonthStart.toISOString(),
                        lte: thisMonthEnd.toISOString()
                    }
                }
            });

            const lastMonthTasks = await db.tasks.findMany({
                where: {
                    workspaceId: workspaceId,
                    dueDate: {
                        gte: lastMonthStart.toISOString(),
                        lte: lastMonthEnd.toISOString()
                    }
                }
            });

            const taskCount = thisMonthTasks.length;
            const tasksDifference = taskCount - lastMonthTasks.length;

            const thisMonthAssignedTasks = await db.tasks.findMany({
                where: {
                    workspaceId: workspaceId,
                    assigneeId: isMember.userId,
                    dueDate: {
                        gte: thisMonthStart.toISOString(),
                        lte: thisMonthEnd.toISOString()
                    }
                }
            });
            
            const lastMonthAssignedTasks = await db.tasks.findMany({
                where: {
                    workspaceId: workspaceId,
                    assigneeId: isMember.userId,
                    dueDate: {
                        gte: lastMonthStart.toISOString(),
                        lte: lastMonthEnd.toISOString()
                    }
                }
            });

            const assignedTaskCount = thisMonthAssignedTasks.length;
            const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.length;

            const thisMonthIncompleteTasks = await db.tasks.findMany({
                where: {
                    workspaceId: workspaceId,
                    status: {
                        not: TaskStatus.DONE
                    },
                    dueDate: {
                        gte: thisMonthStart.toISOString(),
                        lte: thisMonthEnd.toISOString()
                    }
                }
            });
            
            const lastMonthIncompleteTasks = await db.tasks.findMany({
                where: {
                    workspaceId: workspaceId,
                    status: {
                        not: TaskStatus.DONE
                    },
                    dueDate: {
                        gte: lastMonthStart.toISOString(),
                        lte: lastMonthEnd.toISOString()
                    }
                }
            });

            const incompleteTaskCount = thisMonthIncompleteTasks.length;
            const incompleteTaskDifference = incompleteTaskCount - lastMonthIncompleteTasks.length;


            const thisMonthCompletedTasks = await db.tasks.findMany({
                where: {
                    workspaceId: workspaceId,
                    status: TaskStatus.DONE,
                    dueDate: {
                        gte: thisMonthStart.toISOString(),
                        lte: thisMonthEnd.toISOString()
                    }
                }
            });
            
            const lastMonthCompletedTasks = await db.tasks.findMany({
                where: {
                    workspaceId: workspaceId,
                    status: TaskStatus.DONE,
                    dueDate: {
                        gte: lastMonthStart.toISOString(),
                        lte: lastMonthEnd.toISOString()
                    }
                }
            });

            const completedTaskCount = thisMonthCompletedTasks.length;
            const completedTaskDifference = completedTaskCount - lastMonthCompletedTasks.length;


            const thisMonthOverdueTasks = await db.tasks.findMany({
                where: {
                    workspaceId: workspaceId,
                    status: {
                        not: TaskStatus.DONE
                    },
                    dueDate: {
                        lt: now.toISOString(),
                        gte: thisMonthStart.toISOString(),
                        lte: thisMonthEnd.toISOString()
                    }
                }
            });
            
            const lastMonthOverdueTasks = await db.tasks.findMany({
                where: {
                    workspaceId: workspaceId,
                    status: {
                        not: TaskStatus.DONE
                    },
                    dueDate: {
                        lt: now.toISOString(),
                        gte: lastMonthStart.toISOString(),
                        lte: lastMonthEnd.toISOString()
                    }
                }
            });

            const overdueTasksCount = thisMonthOverdueTasks.length;
            const overdueTasksDifference = overdueTasksCount - lastMonthOverdueTasks.length;


            return c.json({
                data: {
                    taskCount,
                    tasksDifference,
                    assignedTaskCount,
                    assignedTaskDifference,
                    completedTaskCount,
                    completedTaskDifference,
                    incompleteTaskCount,
                    incompleteTaskDifference,
                    overdueTasksCount,
                    overdueTasksDifference
                }
            }, 200);

        }
    )


export default app;