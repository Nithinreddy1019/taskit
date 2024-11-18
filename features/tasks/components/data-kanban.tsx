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
};


export const DataKanban = ({
    data
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




    return (
        <DragDropContext onDragEnd={() => {}}>
            <div className="flex overflow-x-auto">
                {boards.map((board) => {
                    return (
                        <div key={board} className="flex mx-2 px-1.5 py-1 bg-muted rounded-md min-w-[200px]">
                            <KanbanColumnHeader 
                                board={board}
                                taskCount={tasks[board].length}
                            />
                        </div>
                    )
                })}
            </div>
        </DragDropContext>
    )
}

