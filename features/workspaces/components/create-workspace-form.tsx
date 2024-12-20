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
import { useCreateWorkspace } from "../api/use-create-workspace";

import { createWorkspaceSchema } from "../schemas"
import { ImageIcon, Loader } from "lucide-react";
import { ChangeEvent, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";


interface CreateWorkspaceFormProps {
    onCancel?: () => void
};


export const CreateWorkspaceForm = ({
    onCancel,
}: CreateWorkspaceFormProps) => {

    const router = useRouter();

    const { isPending, mutate } = useCreateWorkspace();

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: "",
            image: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof createWorkspaceSchema>) => {

        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : ""
        };
        mutate({ form: finalValues }, {
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
                                                                field.onChange(null);
                                                                if(inputRef.current) {
                                                                    inputRef.current.value = ""
                                                                }
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