import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono"
import * as z from "zod";
import { auth } from "@/auth";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";


import { db } from "@/lib/db";
import { deleteFromBucket, generateSignedUrl, isValidFileSize, putImageInBucket, randomImageName } from "@/lib/s3";
import { createProjectSchema, updateProjectSchema } from "../schemas";
import { TaskStatus } from "@/features/tasks/types";
import { ProjectType } from "../types";


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
    .get("/:projectId",
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401);
            };

            const { projectId } = c.req.param();

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
                return c.json({ error: "unauthorized" }, 401)
            };

            const projectData: ProjectType = {
                id: project?.id!,
                name: project?.name!,
                image: project?.image !== null ? await generateSignedUrl(project?.image!): null,
                createdAt: new Date(project?.createdAt!),
                workspaceId: project?.workspaceId!
            }
        
            return c.json({ data: projectData }, 200);

        }
    )
    .get("/:projectId/analytics",
        async (c) => {
            const session = await auth();
            if(!session?.user) {
                return c.json({ error: "Unauthorized" }, 401);
            };

            const { projectId } = c.req.param();

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
                return c.json({ error: "Unauthorized" }, 401)
            };

            const now = new Date();
            const thisMonthStart = startOfMonth(now);
            const thisMonthEnd = endOfMonth(now);
            const lastMonthStart = startOfMonth(subMonths(now, 1));
            const lastMonthEnd = endOfMonth(subMonths(now, 1));

            const thisMonthTasks = await db.tasks.findMany({
                where: {
                    projectId: projectId,
                    dueDate: {
                        gte: thisMonthStart.toISOString(),
                        lte: thisMonthEnd.toISOString()
                    }
                }
            });

            const lastMonthTasks = await db.tasks.findMany({
                where: {
                    projectId: projectId,
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
                    projectId: projectId,
                    assigneeId: isMember.userId,
                    dueDate: {
                        gte: thisMonthStart.toISOString(),
                        lte: thisMonthEnd.toISOString()
                    }
                }
            });
            
            const lastMonthAssignedTasks = await db.tasks.findMany({
                where: {
                    projectId: projectId,
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
                    projectId: projectId,
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
                    projectId: projectId,
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
                    projectId: projectId,
                    status: TaskStatus.DONE,
                    dueDate: {
                        gte: thisMonthStart.toISOString(),
                        lte: thisMonthEnd.toISOString()
                    }
                }
            });
            
            const lastMonthCompletedTasks = await db.tasks.findMany({
                where: {
                    projectId: projectId,
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
                    projectId: projectId,
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
                    projectId: projectId,
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