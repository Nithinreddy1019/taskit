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
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod";

import { updateWorkspaceSchema } from "../schemas"
import { ImageIcon, Loader, Undo2 } from "lucide-react";
import { ChangeEvent, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { WorkspaceType } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface UpdateWorkspaceFormProps {
    onCancel?: () => void,
    initialValues: WorkspaceType,
};


export const UpdateWorkspaceForm = ({
    onCancel,
    initialValues
}: UpdateWorkspaceFormProps) => {

    const router = useRouter();

    const { isPending, mutate } = useUpdateWorkspace()

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.image ?? "",
        }
    });

    const onSubmit = async (values: z.infer<typeof updateWorkspaceSchema>) => {

        const finalValues = {
            ...values,
            name: values.name as string,
            image: values.image instanceof File ? values.image : values.image !== "" ? values.image : ""
        };

        console.log(finalValues)

        mutate({ 
            form: finalValues, 
            param: { workspaceId: initialValues.id }
        }, {
            onSuccess: (responseData) => {
                form.reset();
                if('data' in responseData) {
                    router.push(`/workspaces/${responseData.data.id}`)
                }
            }
        });
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(file) {
            form.setValue("image", file);
        }
    };

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-6">
                <CardTitle className="text-xl font-semibold">
                    {initialValues.name}
                </CardTitle>
                <TooltipProvider>
                    <Tooltip delayDuration={1}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="px-1.5 py-0 h-[28px]"
                                onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.id}`)}
                            >
                                <Undo2 className="size-4" strokeWidth={3}/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Go back</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
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
                            <FormField 
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-y-2">
                                        <div className="flex items-center gap-x-5">
                                            {field.value ? (
                                                <div className="size-[68px] relative rounded-md overflow-hidden">
                                                    <Image
                                                        alt="worspace logo"
                                                        fill
                                                        className="object-cover"
                                                        src={
                                                            field.value instanceof File
                                                            ? URL.createObjectURL(field.value)
                                                            : field.value
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <Avatar className="size-[68px]">
                                                    <AvatarFallback>
                                                        <ImageIcon className="size-[34px] text-neutral-600"/>
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className="flex flex-col">
                                                <p className="text-sm">Workspace Icon</p>
                                                <p className="text-xs text-muted-foreground">JPG, PNG, SVG or JPEG; max 2MB</p>
                                                <input 
                                                    className="hidden"
                                                    type="file"
                                                    accept=".jpg, .svg, .png, .jpeg"
                                                    ref={inputRef}
                                                    disabled={isPending}
                                                    onChange={handleImageChange}
                                                />
                                                {field.value ? 
                                                    (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="xs"
                                                            disabled={isPending}
                                                            className="mt-2 w-fit"
                                                            onClick={() => {
                                                                field.onChange("");
                                                                if(inputRef.current) {
                                                                    inputRef.current.value = ""
                                                                }
                                                                console.log(field.value)
                                                            }}
                                                        >
                                                            Remove image
                                                        </Button>
                                                    ) :
                                                    (
                                                        <Button
                                                            type="button"
                                                            variant="tertiary"
                                                            size="xs"
                                                            disabled={isPending}
                                                            className="mt-2 w-fit"
                                                            onClick={() =>inputRef.current?.click()}
                                                        >
                                                            Select image
                                                        </Button>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
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
                                        <p>Updating workspace...</p>
                                    </div>  
                                ) : "Update workspace"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}