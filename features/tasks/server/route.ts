import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { auth } from "@/auth";
import { z } from "zod";

import { createTaskSchema } from "../schemas";
import { db } from "@/lib/db";
import { TaskPriority, TaskStatus, TaskType } from "../types";
import { generateSignedUrl } from "@/lib/s3";


const app = new Hono()
    .post("/",
        zValidator("json", createTaskSchema),
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401)
            };

            const {
                name,
                description,
                status,
                priority,
                assigneeId,
                projectId,
                workspaceId,
                dueDate
            } = c.req.valid("json");

            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: workspaceId
                    }
                }
            });
            if(!isMember) {
                return c.json({ error: "Unauthorized" }, 401)
            };

            // TODO: Why do we need workpsaceID, need projectID
            const highestPositiontask = await db.tasks.findMany({
                where: {
                    status: status,
                    workspaceId: workspaceId
                },
                orderBy: {
                    position: "desc"
                },
                take: 1
            });

            const newPosition = highestPositiontask.length > 0
                ? highestPositiontask[0].position + 1000
                : 1000;

            // Ensure that you areputtin in ISO string date
            const task = await db.tasks.create({
                data: {
                    name: name,
                    description: description,
                    status: status,
                    priority: priority,
                    assigneeId: assigneeId,
                    projectId: projectId,
                    workspaceId: workspaceId,
                    position: newPosition,                        
                    dueDate: dueDate
                }
            });

            return c.json({ data: task }, 200);

        }
    )
    .get("/",
        zValidator("query", z.object({
            workspaceId: z.string(),
            projectId: z.string().nullish(),
            assigneeId: z.string().nullish(),
            status: z.nativeEnum(TaskStatus).nullish(),
            priority: z.nativeEnum(TaskPriority).nullish(),
            search: z.string().nullish(),
            dueDate: z.string().nullish()
        })),
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401)
            };

            const {
                workspaceId,
                projectId,
                assigneeId,
                status,
                priority,
                search,
                dueDate
            } =  c.req.valid("query");

            console.log("WorkspaceIdw" , workspaceId);

            if(!workspaceId) {
                return c.json({ error: "Unauthorized" }, 401)
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
                return c.json({ error: "Unauthorized" }, 401)
            };



            const tasks = await db.tasks.findMany({
                where: {
                    workspaceId: workspaceId,
                    ...(projectId? { projectId: projectId} : {}),
                    ...(status ? { status: status } : {}),
                    ...(assigneeId ? { assigneeId: assigneeId } : {}),
                    ...(dueDate ? { dueDate: dueDate } : {}),
                    ...(priority ? {priority: priority } : {}),
                    ...(search ? { name: {
                            contains: search,
                            mode: "insensitive"
                        }} : {})
                },
                orderBy: {
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true,
                    priority: true,
                    position: true,
                    dueDate: true,
                    createdAt: true,
                    projectId: true,
                    workspaceId: true,
                    project: {
                        select: {
                            id: true,
                            name: true,
                            image: true,

                        }
                    },
                    assigneeId: true,
                    assignee: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true
                        }
                    }
                }
            });


            const updatedTasks: TaskType[] = await Promise.all(
                tasks.map(async (task: TaskType): Promise<TaskType> => {
                    if(task.project.image) {
                        const imageUrl = await generateSignedUrl(task.project.image);
                        return {
                            ...task,
                            project: {
                                ...task.project,
                                image: imageUrl
                            }
                        };
                    };

                    return task
                })
            );

            return c.json({ data: updatedTasks }, 200);
            // WIP: Ensure there are no bugs/corener cases
        }
    )
    .delete("/:taskId",
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401)
            };

            const { taskId } = c.req.param();

            const task = await db.tasks.findUnique({
                where: {
                    id: taskId
                }
            });

            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: task?.workspaceId!
                    }
                }
            });

            if(!isMember) {
                return c.json({ error: "unauthorized "}, 401)
            };

            await db.tasks.delete({
                where: {
                    id: taskId
                }
            });

            return c.json({ data: { id: task?.id } }, 200);

        }
    )
    .patch("/:taskId",
        zValidator("json", createTaskSchema.partial()),
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401)
            };

            const {
                name,
                description,
                status,
                priority,
                assigneeId,
                projectId,
                workspaceId,
                dueDate
            } = c.req.valid("json");
            const { taskId } = c.req.param();

            const existingTask = await db.tasks.findUnique({
                where: {
                    id: taskId
                }
            });

            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: existingTask?.workspaceId!
                    }
                }
            });
            if(!isMember) {
                return c.json({ error: "Unauthorized" }, 401)
            };



            // Ensure that you areputtin in ISO string date
            const task = await db.tasks.update({
                where: {
                    id: taskId
                },
                data: {
                    name: name,
                    description: description,
                    status: status,
                    priority: priority,
                    assigneeId: assigneeId,
                    projectId: projectId,
                    workspaceId: workspaceId,
                    dueDate: dueDate
                }
            });

            return c.json({ data: task }, 200);

        }
    )
    .get("/:taskId",
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 200);
            };

            const { taskId } = c.req.param();

            const existingTask = await db.tasks.findUnique({
                where: {
                    id: taskId
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true,
                    priority: true,
                    position: true,
                    dueDate: true,
                    createdAt: true,
                    projectId: true,
                    workspaceId: true,
                    project: {
                        select: {
                            id: true,
                            name: true,
                            image: true,

                        }
                    },
                    assigneeId: true,
                    assignee: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true
                        }
                    }
                }
            });

            const isMember = await db.members.findUnique({
                where: {
                    memberId: {
                        userId: session.user.id!,
                        workspaceId: existingTask?.workspaceId!
                    }
                }
            });
            if(!isMember) {
                return c.json({ error: "Unauthorized" }, 401)
            };

            let updatedTask = existingTask;

            if(existingTask?.project.image) {
                const imageUrl = await generateSignedUrl(existingTask.project.image);
                updatedTask = {
                    ...existingTask,
                    project: {
                        ...existingTask.project,
                        image: imageUrl
                    }
                }
            };


            return c.json({ data: updatedTask }, 200);

        }
    )

export default app;