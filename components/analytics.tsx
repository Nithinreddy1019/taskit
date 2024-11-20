import { ProjectAnalyticsResponsetype } from "@/features/projects/api/use-get-project-analytics"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { AnalyticsCard } from "./analytics-card"
import { Separator } from "./ui/separator"



export const Analytics = ({
    data
}: ProjectAnalyticsResponsetype) => {
    return (
        <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
            <div className="w-full flex flex-row">
                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="Total tasks"
                        value={data.taskCount}
                        variant={data.tasksDifference > 0 ? "UP" : "DOWN"}
                        increaseValue={data.tasksDifference}
                    />
                    <Separator orientation="vertical"/>
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="Assigned tasks"
                        value={data.assignedTaskCount}
                        variant={data.assignedTaskDifference > 0 ? "UP" : "DOWN"}
                        increaseValue={data.assignedTaskDifference}
                    />
                    <Separator orientation="vertical"/>
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="Completed tasks"
                        value={data.completedTaskCount}
                        variant={data.completedTaskDifference > 0 ? "UP" : "DOWN"}
                        increaseValue={data.completedTaskDifference}
                    />
                    <Separator orientation="vertical"/>
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="Overdue tasks"
                        value={data.overdueTasksCount}
                        variant={data.overdueTasksDifference > 0 ? "UP" : "DOWN"}
                        increaseValue={data.overdueTasksDifference}
                    />
                    <Separator orientation="vertical"/>
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="Incomplete tasks"
                        value={data.incompleteTaskCount}
                        variant={data.incompleteTaskDifference > 0 ? "UP" : "DOWN"}
                        increaseValue={data.incompleteTaskDifference}
                    />
                </div>
            </div>
            <ScrollBar orientation="horizontal"/>
        </ScrollArea>
    )
}