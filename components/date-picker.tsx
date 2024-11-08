"use client"

import { format } from "date-fns"


import { Calendar } from "@/components/ui/calendar";
import { 
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Calendar1Icon } from "lucide-react";
import { cn } from "@/lib/utils";


interface DatePickerProps {
    value: Date | undefined,
    onChange: (date: Date) => void,
    palceholder?: string,
    className?: string
}


export const DatePicker = ({
    value,
    onChange,
    palceholder,
    className
}: DatePickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal px-3",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <Calendar1Icon className="mr-2 size-4"/>
                    {value ? format(value, "PPP") : <span>{palceholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar 
                    mode="single"
                    selected={value}
                    onSelect={(date) => onChange(date as Date)}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
};