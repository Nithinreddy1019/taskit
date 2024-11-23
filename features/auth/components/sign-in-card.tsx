
import { DottedSeparator } from "@/components/dotted-separator";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormLabel,
    FormMessage,
    FormItem,
    FormField
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signInSchema } from "../schemas/signin-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { AuthFooter } from "./auth-footer";
import { useLogin } from "../api/use-login";

import { FiLoader } from "react-icons/fi";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";



export const SignInCard = () => {


    const { mutate, isPending } = useLogin()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema) ,
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof signInSchema>) => {
        mutate(values);
    }

    return (
        <Card className="w-full max-w-[600px] h-full p-4 shadow-none border-none dark:bg-[#141414]">
            <CardHeader className="flex items-start justify-center gap-y-4">
                <Image 
                    src={"/logo.svg"}
                    alt="logo"
                    height={40}
                    width={40}
                />
                <div>
                    <CardTitle className="text-lg">
                        Signin to Taskit
                    </CardTitle>
                    <p className="text-muted-foreground">Manage your project, team and delegate tasks.</p>
                </div>
            </CardHeader>
            
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
                        <div className="space-y-4">
                            <FormField 
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                type="email"
                                                placeholder="Email"
                                                disabled={isPending}
                                                className="focus-visible:ring-blue-500 dark:bg-[#0B0CO0E] h-10 rounded-lg"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                type="password"
                                                placeholder="Password"
                                                disabled={isPending}
                                                className="focus-visible:ring-blue-500 dark:bg-[#0B0CO0E] h-10 rounded-lg"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            disabled={isPending}
                            className="w-full font-semibold"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <FiLoader className="size-4 animate-spin"/>
                                    Signing in...
                                </div>
                            ) : ("Sign in")}
                        </Button>
                    </form>
                </Form>

                <div className="my-10 relative flex flex-col items-center">
                    <Separator className="dark:bg-neutral-600"/>
                    <p className="absolute top-1/2 -translate-y-1/2 bg-white dark:bg-[#141414] px-2 text-muted-foreground">Or authorize with</p>
                </div>

                <div className="space-y-2">

                    <Button
                        className="w-full rounded-lg h-10"
                        variant="outline"
                        onClick={() => signIn("google")}
                    >
                        <FcGoogle />
                        Sign in with Google
                    </Button>
                    <Button
                        className="w-full rounded-lg h-10"
                        variant="outline"
                        onClick={() => signIn("github")}
                    >
                        <FaGithub />
                        Sign in with Github
                    </Button>
                </div>

                <div className="mt-8 space-y-4">
                    <AuthFooter 
                        footerText="Don't have an account?"
                        footerLink="/sign-up"
                        linkText="Sign up"
                        showPasswordReset
                    />
                </div>
            </CardContent>
        </Card>
    )
}