import { DottedSeparator } from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { PlusIcon } from "lucide-react"


export const TaskViewSwitcher = () => {
    return (
        <Tabs 
            className="flex-1 w-full border rounded-lg"
        >
            <div className="h-full flex flex-col overflow-auto p-4">
                <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger
                            className="h-8 w-full lg:w-auto"
                            value="table"
                        >
                            Table
                        </TabsTrigger>
                        <TabsTrigger
                            className="h-8 w-full lg:w-auto"
                            value="kanban"
                        >
                            Kanban
                        </TabsTrigger>
                        <TabsTrigger
                            className="h-8 w-full lg:w-auto"
                            value="calendar"
                        >
                            Calendar
                        </TabsTrigger>
                    </TabsList>
                    <Button
                        variant="default"
                        size="sm"
                        className="w-full lg:w-auto"
                    >
                        <PlusIcon className="size-4"/>
                        New task
                    </Button>
                </div>

                <Separator className="my-4"/>
                {/* Add Filters: WIP */}
                <p>Data Filters</p>

                <>
                    <TabsContent value="table" className="mt-0">
                        Data table
                    </TabsContent>
                    <TabsContent value="kanban" className="mt-0">
                        Data kanban
                    </TabsContent>
                    <TabsContent value="calendar" className="mt-0">
                        Data calendar
                    </TabsContent>
                </>
            </div>
        </Tabs>
    )
}