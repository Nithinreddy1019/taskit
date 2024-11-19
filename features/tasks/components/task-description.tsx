import { PencilIcon, XIcon } from "lucide-react"
import { TaskType } from "../types"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useUpdateTask } from "../api/use-update-task"
import { Textarea } from "@/components/ui/textarea"

interface TaskDescriptionProps {
    task: TaskType
}

export const TaskDescription = ({
    task
}: TaskDescriptionProps) => {

    const [isEditing, setIsEditing ] = useState(false);
    const [value, setValue] = useState(task.description);

    const { mutate, isPending } = useUpdateTask();

    const handleSave = () => {
        mutate({
            json: { description: value! },
            param: { taskId: task.id }
        })
    };




    return (
        <div className="p-4 border rounded-md">
            <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Decription</p>
                <Button
                    size="sm"
                    variant="tertiary"
                    onClick={() => setIsEditing((prev) => !prev)}
                >
                    {isEditing ? (
                        <XIcon className="size-4"/>
                    ) : (
                        <PencilIcon className="size-4"/>
                    )}
                    {isEditing ? 'Cancel' : "Edit"}
                       
                </Button>
            </div>

            {isEditing ? (
                <div className="mt-4 flex flex-col gap-y-4">
                    <Textarea 
                        placeholder="Add a description"
                        value={value!}
                        rows={3}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={isPending}
                        className="h-full"
                    />
                    <Button
                        size="sm"
                        className="w-fit ml-auto"
                        onClick={handleSave}
                        disabled={isPending}
                    >
                        {isPending ? "Saving..." : "Save changes"}
                    </Button>
                </div>
            ) : (
                <div>
                    {task.description ? (
                        <p className="text-muted-foreground text-sm pt-4">
                            {task.description}
                        </p>
                    ) : (
                        <span className="text-muted-foreground text-sm">
                            No description set
                        </span>
                    )}
                </div>
            )}


            
        </div>
    )
}