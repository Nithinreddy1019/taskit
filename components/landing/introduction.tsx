import { Tag } from "./tag";

const text = "Seamlessly create and manage workspaces, tasks and  collaborate on projects through dynamic Kanban boards, calendar views, and customizable tables.";



export const Introduction = () => {
    return (
        <section className="py-28 lg:py-40">
            <div className="container">
                <div className="flex justify-center">
                    <Tag>Introducing Taskit</Tag>
                </div>
                <div className="text-4xl md:text-6xl lg:text-7xl text-center font-medium mt-10">
                    <span>Task management made better.{" "}</span>
                    <span className="text-white/15">{text}</span>
                    <span className="text-blue-400 block">That&apos;s why Taskit.</span>
                </div>
            </div>
        </section>
    )
}