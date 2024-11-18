"use client"

import { ColumnDef } from "@tanstack/react-table";
import { TaskPriority, TaskStatus, TaskType } from "../types";

import { ArrowUpDown, MoreVerticalIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { TaskStatusIcon } from "./task-status-icon";
import { TaskPriorityIcon } from "./task-priority-icon";
import { TaskActions } from "./task-actions";




export const columns: ColumnDef<TaskType>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Task name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
        },
        cell: ({ row }) => {
            const name = row.original.name;

            return <p className="line-clamp-1">{name}</p>
        }
    },
    {
        accessorKey: "project",
        header: ({ column }) => {
            return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Project
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const project = row.original.project;

            return (
                <div className=" flex items-center gap-2 text-sm font-medium">
                    <ProjectAvatar 
                        imageUrl={project.image!} 
                        name={project.name}
                        className="size-6"
                    />
                    <p className="line-clamp-1">{project.name}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "assignee",
        header: ({ column }) => {
            return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Assignee
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const assignee = row.original.assignee;

            return (
                <div className=" flex items-center gap-2 text-sm font-medium">
                    <MemberAvatar 
                        className="size-6"
                        imageUrl={assignee.image!}
                        name={assignee.name!}
                    /> 
                    <p className="line-clamp-1">{assignee.name}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "dueDate",
        header: ({ column }) => {
            return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Due Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const dueDate = row.original.dueDate;

            return (
                <TaskDate value={dueDate as string}/>
            )
        }
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.original.status;

            return (
                <TaskStatusIcon status={status as TaskStatus}/>
            )
        }
    },
    {
        accessorKey: "priority",
        header: ({ column }) => {
            return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Priority
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const priority = row.original.priority;

            return (
                <TaskPriorityIcon priority={priority as TaskPriority}/>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const id = row.original.id;
            const projectId = row.original.projectId;

            return (
                <TaskActions id={id} projectId={projectId}>
                    <Button variant="ghost" className="size-8 p-0">
                        <MoreVerticalIcon className="size-4"/>
                    </Button>
                </TaskActions>
            )
        }
    }
];