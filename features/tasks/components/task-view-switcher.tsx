"use client"


import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Loader, PlusIcon } from "lucide-react"
import { useCreateTaskModal } from "../hooks/use-create-task-modal"
import { useGetTasks } from "../api/use-get-tasks"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useQueryState } from "nuqs"
import { DataFilters } from "./data-filters"
import { useTaskFilters } from "../hooks/use-task-filters"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { DataKanban } from "./data-kanban"
import { useCallback } from "react"
import { TaskStatus } from "../types"
import { useBulkUpdateTask } from "../api/use-bulk-update-tasks"
import { DataCalendar } from "./data-calendar"


export const TaskViewSwitcher = () => {

    const [view, setView ] = useQueryState("task-view", {
        defaultValue: "table"
    })

    const workspaceId = useWorkspaceId();
    const { open, close } = useCreateTaskModal();

    const { mutate: bulkUpdate } = useBulkUpdateTask();

    const [{
        projectId,
        assigneeId,
        status,
        priority,
        search,
        dueDate
    }] = useTaskFilters();
      
    const { 
        data: tasks, 
        isLoading: isLoadingTasks 
    } = useGetTasks({ 
        workspaceId,
        projectId,
        assigneeId,
        status,
        priority,
        search,
        dueDate
    });

    
    const onKanbanchange = useCallback((
        tasks: {id: string, status: TaskStatus, position:number}[]
    ) => {
        bulkUpdate({ json: { tasks }});
    }, [bulkUpdate])


    return (
        <Tabs
        defaultValue={view}
        onValueChange={setView}
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
                        onClick={open}
                    >
                        <PlusIcon className="size-4"/>
                        New task
                    </Button>
                </div>

                <Separator className="my-2"/>
                
                <DataFilters />

                <Separator className="my-2"/>


                {isLoadingTasks ? 
                    (
                        <div className="w-full border rounded-lg h-[450px] flex flex-col items-center justify-center">
                            <Loader className="size-4 animate-spin"/>
                        </div>
                    )
                    : (
                        <>
                            <TabsContent value="table" className="mt-0">
                                <DataTable columns={columns} data={tasks ?? []}/>
                            </TabsContent>
                            <TabsContent value="kanban" className="mt-0">
                                <DataKanban data={tasks ?? []} onChange={onKanbanchange}/>
                            </TabsContent>
                            <TabsContent value="calendar" className="mt-0">
                                <DataCalendar data={tasks ?? []}/>
                            </TabsContent>
                        </>
                    )
                }
                
            </div>
        </Tabs>
    )
}