"use client"

import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateTaskModal } from "../hooks/use-create-task-modal"
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";
import { TaskStatus } from "../types";



export const CreateTaskModal = () => {
    const { isOpen, setIsOpen, close, status } = useCreateTaskModal();

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateTaskFormWrapper onCancel={close} defaultStatus={status as TaskStatus}/>
        </ResponsiveModal>
    )
}