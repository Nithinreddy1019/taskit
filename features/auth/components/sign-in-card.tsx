
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


export const SignInCard = () => {

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema) ,
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = (values: z.infer<typeof signInSchema>) => {
        console.log(values);
    }

    return (
        <Card className="w-full h-full p-4 shadow-none border-none">
            <CardHeader className="flex items-center justify-center">
                <CardTitle className="text-2xl md:text-3xl">
                    Welcome back!
                </CardTitle>
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
                                                disabled={false}
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
                                                disabled={false}
                                                className="focus-visible:ring-blue-500 text-blue-700/60"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            disabled={false}
                            className="w-full font-semibold"
                        >
                            Sign in
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
                        footerText="Don't have an account?"
                        footerLink="/sign-up"
                        linkText="Sign Up"
                    />
                </div>
            </CardContent>
        </Card>
    )
}