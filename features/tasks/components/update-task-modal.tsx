"use client"

import { ResponsiveModal } from "@/components/responsive-modal";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal"
import { UpdateTaskFormWrapper } from "./update-task-form-wrapper";



export const UpdateTaskModal = () => {
    const { taskId, setTaskId, close } = useUpdateTaskModal();

    return (
        <ResponsiveModal open={!!taskId} onOpenChange={close}>
            { taskId && (
                <UpdateTaskFormWrapper onCancel={close} id={taskId}/>
            )}
        </ResponsiveModal>
    )
}