import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"
import { TaskPriority, TaskStatus } from "../types"




export const useTaskFilters = () => {
    return useQueryStates({
        projectId: parseAsString,
        assigneeId: parseAsString,
        status: parseAsStringEnum(Object.values(TaskStatus)),
        priority: parseAsStringEnum(Object.values(TaskPriority)),
        search: parseAsString,
        dueDate: parseAsString
    })
};