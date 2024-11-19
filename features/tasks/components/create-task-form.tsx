"use client"

import { 
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { useCreateTask } from "../api/use-create-task";

import { createTaskSchema } from "../schemas"
import { Loader } from "lucide-react";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { DatePicker } from "@/components/date-picker";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskPriority, TaskStatus } from "../types";
import { cn } from "@/lib/utils";
import { TaskStatusIcon } from "./task-status-icon";
import { TaskPriorityIcon } from "./task-priority-icon";


interface CreateTaskFormProps {
    onCancel?: () => void,
    projectOptions: { id: string, name: string | null, image: string | null }[],
    memberOptions: { id: string, name: string | null, image: string | null}[],
};


export const CreateTaskForm = ({
    onCancel,
    projectOptions,
    memberOptions
}: CreateTaskFormProps) => {

    const workspaceId = useWorkspaceId();

    const { isPending, mutate } = useCreateTask();


    const form = useForm<z.infer<typeof createTaskSchema>>({
        resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
        defaultValues: {
            workspaceId,
        }
    });

    const onSubmit = async (values: z.infer<typeof createTaskSchema>) => {
        mutate({ json: { ...values, workspaceId} }, {
            onSuccess: (responseData) => {
                form.reset();
                console.log("reached")
                onCancel?.();
                
            }
        });
    };


    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-6">
                <CardTitle className="text-xl font-semibold">
                    Create a new task
                </CardTitle>
            </CardHeader>
            <div className="px-6">
                <DottedSeparator />
            </div>

            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-2">
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Task name
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder="Enter task name"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Due Date
                                        </FormLabel>
                                        <FormControl>
                                            <DatePicker {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="assigneeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Assignee
                                        </FormLabel>
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select assignee"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage />
                                            <SelectContent>
                                                {memberOptions.map((member) => (
                                                    <SelectItem
                                                        key={member.id}
                                                        value={member.id}
                                                    >
                                                        <div className="flex iteme-center gap-x-2">
                                                            <MemberAvatar 
                                                                className="size-6"
                                                                name={member.name!}
                                                                imageUrl={member.image!}
                                                            />
                                                            {member.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Status
                                        </FormLabel>
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Set status"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage />
                                            <SelectContent>
                                                <SelectItem value={TaskStatus.BACKLOG}>
                                                    <TaskStatusIcon status={TaskStatus.BACKLOG}/>
                                                </SelectItem>
                                                <SelectItem value={TaskStatus.TODO}>
                                                    <TaskStatusIcon status={TaskStatus.TODO}/>
                                                </SelectItem>
                                                <SelectItem value={TaskStatus.IN_PROGRESS}>
                                                    <TaskStatusIcon status={TaskStatus.IN_PROGRESS}/>
                                                </SelectItem>
                                                <SelectItem value={TaskStatus.IN_REVIEW}>
                                                    <TaskStatusIcon status={TaskStatus.IN_REVIEW}/>
                                                </SelectItem>
                                                <SelectItem value={TaskStatus.DONE}>
                                                    <TaskStatusIcon status={TaskStatus.DONE} />
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Priority
                                        </FormLabel>
                                        <Select
                                            defaultValue={field.value!}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage />
                                            <SelectContent>
                                                <SelectItem value={TaskPriority.LOW}>
                                                    <TaskPriorityIcon priority={TaskPriority.LOW}/>
                                                </SelectItem>
                                                <SelectItem value={TaskPriority.MEDIUM}>
                                                    <TaskPriorityIcon priority={TaskPriority.MEDIUM}/>
                                                </SelectItem>
                                                <SelectItem value={TaskPriority.HIGH}>
                                                    <TaskPriorityIcon priority={TaskPriority.HIGH}/>
                                                </SelectItem>
                                                <SelectItem value={TaskPriority.EMERGENCY}>
                                                    <TaskPriorityIcon priority={TaskPriority.EMERGENCY}/>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />


                            <FormField 
                                control={form.control}
                                name="projectId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Project
                                        </FormLabel>
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select project"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage />
                                            <SelectContent>
                                                {projectOptions.map((project) => (
                                                    <SelectItem
                                                        key={project.id}
                                                        value={project.id}
                                                    >
                                                        <div className="flex iteme-center gap-x-2">
                                                            <MemberAvatar 
                                                                className="size-6"
                                                                name={project.name!}
                                                                imageUrl={project.image!}
                                                            />
                                                            {project.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            
                        </div>
                        <DottedSeparator className="my-6"/>

                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={onCancel}
                                disabled={isPending}
                                className={cn(!onCancel && "hidden")}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                size="sm"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <div className="flex items-center">
                                        <Loader className="h-4 w-4 mr-2 animate-spin"/>
                                        <p>Creating task...</p>
                                    </div>  
                                ) : "                                Create task"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}