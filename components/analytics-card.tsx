import { FaCaretDown, FaCaretUp } from "react-icons/fa"

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
    title: string,
    value: number,
    variant: "UP" | "DOWN",
    increaseValue: number,
};

export const AnalyticsCard = ({
    title,
    value,
    variant,
    increaseValue
}: AnalyticsCardProps) => {

    const iconColor = variant === "UP" ? "text-emerald-500" : "text-red-500";
    const increaseValueColor = variant === "UP" ? "text-emerald-500" : "text-red-500";
    const Icon = variant === "UP" ? FaCaretUp : FaCaretDown;
    
    
    return (
        <Card className="shadow-none border-none w-full">
            <CardHeader>
                <div className="flex items-center gap-x-2">
                    <CardDescription className="flex items-center gap-x-1.5 font-medium overflow-hidden">
                        <span className="truncate text-base">{title}</span>
                    </CardDescription>
                    <div className="flex items-center gap-x-1">
                        <Icon className={cn(iconColor, "size-4")}/>
                        <span className={cn(increaseValueColor, "truncate text-base font-medium")}>
                            {increaseValue}
                        </span>
                    </div>
                </div>
                <CardTitle className="text-3xl font-semibold">
                    {value}
                </CardTitle>
            </CardHeader>
        </Card>
    )
}