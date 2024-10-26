
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signUpSchema } from "../schemas/signup-schema";
import Link from "next/link";
import { AuthFooter } from "./auth-footer";
import { useRegister } from "../api/use-register";

import { FiLoader } from "react-icons/fi";


export const SignUpCard = () => {


    const { mutate } = useRegister();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema) ,
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof signUpSchema>) => {
        mutate(values);
    }

    return (
        <Card className="w-full h-full p-4 shadow-none border-none">
            <CardHeader className="flex items-center justify-center">
                <CardTitle className="text-2xl md:text-3xl">
                    Sign up
                </CardTitle>
                <p className="text-center mx-auto text-sm">
                    By signing up, you agree to our
                    <span className="text-blue-500"><Link href={"/privacy"}>{'\u00A0'}Privacy policy</Link>{'\u00A0'}</span>
                    and
                    <span className="text-blue-500"><Link href={"/terms"}>{'\u00A0'}Terms of service</Link></span>
                </p>
            </CardHeader>
            <div className="px-4">
                <DottedSeparator />
            </div>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-8">
                        <div className="space-y-4">
                        <FormField 
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                type="text"
                                                placeholder="Enter your username"
                                                disabled={isPending}
                                                className="focus-visible:ring-blue-500 text-blue-700/60"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                type="email"
                                                placeholder="Enter your email"
                                                disabled={isPending}
                                                className="focus-visible:ring-blue-500 text-blue-700/60"
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
                                        <FormLabel>
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                type="password"
                                                placeholder="Enter your password"
                                                disabled={isPending}
                                                className="focus-visible:ring-blue-500 text-blue-700/60"
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
                                    Signinup...
                                </div>
                            ) : ("Sign Up")}
                        </Button>
                    </form>
                </Form>

                <div className="space-y-4 mt-8">
                    <DottedSeparator />

                    <Button
                        className="w-full"
                        variant="outline"
                    >
                        <FcGoogle />
                        Sign in with Google
                    </Button>
                    <Button
                        className="w-full"
                        variant="secondary"
                    >
                        <FaGithub />
                        Sign in with Github
                    </Button>
                </div>

                <div className="mt-8 space-y-4">
                    <DottedSeparator />

                    <AuthFooter 
                        footerText="Already have an account?"
                        footerLink="/sign-in"
                        linkText="Sign In"
                    />
                </div>
            </CardContent>
        </Card>
    )
}