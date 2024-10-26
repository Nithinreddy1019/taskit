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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { useCreateWorkspace } from "../api/use-create-workspace";

import { createWorkspaceSchema } from "../schemas"
import { Loader } from "lucide-react";


interface CreateWorkspaceFormProps {
    onCancel?: () => void
};


export const CreateWorkspaceForm = ({
    onCancel,
}: CreateWorkspaceFormProps) => {

    const { isPending, mutate } = useCreateWorkspace();

    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof createWorkspaceSchema>) => {
        console.log(values);
        mutate({
            json: values
        });
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-6">
                <CardTitle className="text-xl font-semibold">
                    Create a new workspace
                </CardTitle>
            </CardHeader>
            <div className="px-6">
                <DottedSeparator />
            </div>

            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Workspace name
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder="Enter your worksapce name"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                                        <p>Creating workspace...</p>
                                    </div>  
                                ) : "                                Create a workspace"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}