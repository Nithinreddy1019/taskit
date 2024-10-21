
import { DottedSeparator } from "@/components/dotted-separator";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";


export const SignInCard = () => {
    return (
        <Card className="w-full h-full bg-neutral-100 p-4 shadow-none border-none">
            <CardHeader className="flex items-center justify-center">
                <CardTitle className="text-2xl md:text-3xl">
                    Welcome back!
                </CardTitle>
            </CardHeader>
            <div className="px-4">
                <DottedSeparator />
            </div>
        </Card>
    )
}