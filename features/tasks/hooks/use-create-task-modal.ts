import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { TaskStatus } from "../types";



export const useCreateTaskModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-task",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    );


    const [status, setStatus] = useQueryState(
        "task-status",
        parseAsString.withDefault("").withOptions({ clearOnDefault: true })
    );

    const open = ({status: newStatus}: {status: TaskStatus}) => {
        setIsOpen(true);
        setStatus(newStatus);
    }
    const close = () => setIsOpen(false);


    return {
        isOpen, open, close, setIsOpen, status
    }
};


