"use client"

import React, { useCallback, useState, useEffect } from "react";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";


import { TaskType, TaskStatus } from "../types";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


const boards: TaskStatus[] = [
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,
];

type TasksState = {
    [key in TaskStatus]: TaskType[];
};

interface DataKanbanProps {
    data: TaskType[],
    onChange: (tasks: {id: string, status: TaskStatus, position: number}[]) => void;
};


export const DataKanban = ({
    data,
    onChange
}: DataKanbanProps) => {

    const [tasks, setTasks] = useState<TasksState>(() => {
        const initialTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
        };


        data.forEach((task) => {
            initialTasks[task.status].push(task);
        });

        Object.keys(initialTasks).forEach((status) => {
            initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position)
        });

        return initialTasks;
    });

    useEffect(() => {
        const newTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
        };

        data.forEach((task) => {
            newTasks[task.status].push(task);
        });

        Object.keys(newTasks).forEach((status) => {
            newTasks[status as TaskStatus].sort((a, b) => a.position - b.position)
        });

        setTasks(newTasks);
    }, [data]);


    const onDragEnd = useCallback((result: DropResult) => {
        if(!result.destination) return;

        const { source, destination } = result;
        const sourceStatus = source.droppableId as TaskStatus;
        const destStatus = destination.droppableId as TaskStatus;

        let updatesPayload: { id: string, status: TaskStatus, position: number }[] = [];

        setTasks((prevTasks) => {
            const newTasks = {...prevTasks};

            // Removing the task from source column
            const sourceColumn = [...newTasks[sourceStatus]];
            const [movedTask] = sourceColumn.splice(source.index, 1);

            // IF there is no moved task, then we return prvious state
            if(!movedTask) {
                console.error("No task found at source index");
                return prevTasks;
            }

            // Now create a new task object with potentially updated status
            const updatedMovedTask = sourceStatus !== destStatus 
                ? { ...movedTask, status: destStatus }
                : movedTask;
            
            // Update siource column
            newTasks[sourceStatus] = sourceColumn;

            // Now add the tsaak to new destination column
            const destColumn = [...newTasks[destStatus]];
            destColumn.splice(destination.index, 0, updatedMovedTask);
            newTasks[destStatus] = destColumn;


            // Preparing minimal update payload
            updatesPayload = [];

            // Always update the moved task
            updatesPayload.push({
                id: updatedMovedTask.id,
                status: destStatus,
                position: Math.min((destination.index + 1) * 1000, 1000000)
            });


            // update positions for the affected tasks in the destonation colun
            newTasks[destStatus].forEach((task, index) => {
                if(task && task.id !== updatedMovedTask.id) {
                    const newPosition = Math.min((index + 1) * 1000, 1000000);
                    if(task.position !== newPosition) {
                        updatesPayload.push({
                            id: task.id,
                            status: destStatus,
                            position: newPosition
                        });
                    }
                }
            });


            // If the task has been moved between columsn, then update positions in src column
            if(sourceStatus !== destStatus) {
                newTasks[sourceStatus].forEach((task, index) => {
                    if(task) {
                        const newPosition = Math.min((index + 1) * 1000, 1000000);
                        if(task.position !== newPosition) {
                            updatesPayload.push({
                                id: task.id,
                                status: sourceStatus,
                                position: newPosition
                            });
                        }
                    }
                });
            };

            return newTasks;

        });

        onChange(updatesPayload);
    }, [onChange]);


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto">
                {boards.map((board) => {
                    return (
                        <div key={board} className="flex-1 mr-2 py-1 bg-muted dark:bg-neutral-900 rounded-md min-w-[200px]">
                            <KanbanColumnHeader 
                                board={board}
                                taskCount={tasks[board].length}
                            />
                            <Droppable droppableId={board}>
                                {(provided) => (
                                    <ScrollArea>
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="min-h-[200px] py-1.5 max-h-[700px]"
                                    >
                                        {tasks[board].map((task, index) => (
                                            <Draggable
                                                key={task.id}
                                                draggableId={task.id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className=""
                                                    >
                                                        <KanbanCard task={task}/>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                    <ScrollBar />
                                    </ScrollArea>
                                )}
                            </Droppable>
                        </div>
                    )
                })}
            </div>
        </DragDropContext>
    )
}

