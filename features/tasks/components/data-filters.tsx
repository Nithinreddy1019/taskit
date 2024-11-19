
import { DatePicker } from "@/components/date-picker";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectSeparator,
    SelectItem,
} from "@/components/ui/select";



import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { FolderIcon, ListCheckIcon, User } from "lucide-react";
import { TaskPriority, TaskStatus } from "../types";
import { TaskStatusIcon } from "./task-status-icon";
import { useTaskFilters } from "../hooks/use-task-filters";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useEffect } from "react";
import { TaskPriorityIcon } from "./task-priority-icon";



interface DataFiltersProps {
    hideProjectFilter?: boolean,
}


export const DataFilters = ({
    hideProjectFilter
}: DataFiltersProps) => {

    const workspaceId = useWorkspaceId();
    const defaultProjectId = useProjectId();


    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

    const isLoading = isLoadingProjects || isLoadingMembers;


    const projectOptions = projects?.map((project) => (
        {
            value: project.id,
            name: project.name,
            image: project.imageUrl
        }
    ));

    const memberOptions = members?.map((member) => (
        {
            value: member.userId,
            name: member.name,
            image: member.image
        }
    ));

    const [{
        projectId,
        assigneeId,
        status,
        priority,
        search,
        dueDate
    }, setFilters] = useTaskFilters();
    


    const onStatusChange = (value: string) => {
        if(value === "all") {
            setFilters({ status: null })
        } else {
            setFilters({ status: value as TaskStatus})
        }
    };

    const onAssigneeChange = (value: string) => {
        setFilters({ assigneeId: value === "all" ? null : value as string})
    };

    const onProjectChange = (value: string) => {
        setFilters({ projectId: value === "all" ? null : value as string})
    };

    const onPriorityChange = (value: string) => {
        setFilters({ priority: value === "all" ? null : value as TaskPriority})
    };


    useEffect(() => {
        if (defaultProjectId && !projectId) {
            setFilters({ projectId: defaultProjectId });
        }
    }, [defaultProjectId]);

    if(isLoading) return null;

    return (
        <div className="flex flex-col lg:flex-row gap-2">

            {/* Status selecting  */}
            <Select
                defaultValue={status ?? undefined}
                onValueChange={(value) => onStatusChange(value)}
            >
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <ListCheckIcon className="size-4 mr-2"/>
                        <SelectValue placeholder={"All status"}/>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        All status
                    </SelectItem>
                    <SelectSeparator />
                    <SelectItem value={TaskStatus.BACKLOG}>
                        <TaskStatusIcon status={TaskStatus.BACKLOG}/>
                    </SelectItem>
                    <SelectItem value={TaskStatus.TODO}>
                        <TaskStatusIcon status={TaskStatus.TODO}/>
                    </SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>
                        <TaskStatusIcon status={TaskStatus.IN_PROGRESS}/>
                    </SelectItem>
                    <SelectItem value={TaskStatus.IN_REVIEW}>
                        <TaskStatusIcon status={TaskStatus.IN_REVIEW}/>
                    </SelectItem>
                    <SelectItem value={TaskStatus.DONE}>
                        <TaskStatusIcon status={TaskStatus.DONE}/>
                    </SelectItem>
                </SelectContent>
            </Select>


            {/* assignee filter selecting  */}
            <Select
                defaultValue={assigneeId ?? undefined}
                onValueChange={(value) => onAssigneeChange(value)}
            >
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <User className="size-4 mr-2"/>
                        <SelectValue placeholder={"All assignees"}/>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        All assignees
                    </SelectItem>
                    <SelectSeparator />
                    {memberOptions?.map((member) => (
                        <SelectItem
                            key={member.value}
                            value={member.value}
                        >   
                            <div className="flex items-center gap-x-1">
                                <MemberAvatar imageUrl={member.image!} name={member.name!} className="size-4"/>
                                <p>{member.name}</p>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


            {/* project filter selecting  */}
            {!hideProjectFilter && (
                <Select
                    defaultValue={defaultProjectId && !projectId ? defaultProjectId : projectId ?? undefined}
                    onValueChange={(value) => onProjectChange(value)}
                >
                    <SelectTrigger className="w-full lg:w-auto h-8">
                        <div className="flex items-center pr-2">
                            <FolderIcon className="size-4 mr-2"/>
                            <SelectValue placeholder={"All projects"}/>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            All projects
                        </SelectItem>
                        <SelectSeparator />
                        {projectOptions?.map((project) => (
                            <SelectItem
                                key={project.value}
                                value={project.value}
                            >   
                                <div className="flex items-center gap-x-1">
                                    <ProjectAvatar imageUrl={project.image!} name={project.name!} className="size-4"/>
                                    <p>{project.name}</p>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}


            {/* dueDate filter */}
            <DatePicker 
                palceholder="Due date"
                className="h-8 w-full lg:w-auto"
                value={dueDate ? new Date(dueDate) : undefined}
                onChange={(date) => {
                    setFilters({ dueDate: date ? date.toISOString() : null})
                }}
            />

            {/* Priority filter */}
            <Select
                defaultValue={priority ?? undefined}
                onValueChange={(value) => onPriorityChange(value)}
            >
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <ListCheckIcon className="size-4 mr-2"/>
                        <SelectValue placeholder={"All priorities"}/>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        All priorities
                    </SelectItem>
                    <SelectSeparator />
                    <SelectItem value={TaskPriority.LOW}>
                        <TaskPriorityIcon priority={TaskPriority.LOW}/>
                    </SelectItem>
                    <SelectItem value={TaskPriority.MEDIUM}>
                        <TaskPriorityIcon priority={TaskPriority.MEDIUM}/>
                    </SelectItem>
                    <SelectItem value={TaskPriority.HIGH}>
                        <TaskPriorityIcon priority={TaskPriority.HIGH}/>
                    </SelectItem>
                    <SelectItem value={TaskPriority.EMERGENCY}>
                        <TaskPriorityIcon priority={TaskPriority.EMERGENCY}/>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
};