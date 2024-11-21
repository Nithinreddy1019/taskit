import { FeatureCard } from "./feature-card"
import { Tag } from "./tag"
import rolesImage from "@/assets/roles.svg";
import kanbanImage from "@/assets/kanban.svg";
import collaborationImage from "@/assets/collaboration.svg";
import Image from "next/image";


const featuresList = [
    "Collaboration",
    "Workspaces",
    "Table view",
    "Kanban board",
    "Calendar view",
    "Intuitive design"
]


export const Features = () => {
    return (
        <section className="py-24">
            <div className="container">
                <div className="flex justify-center">
                    <Tag>Features</Tag>
                </div>
                <h2 className="text-6xl max-w-2xl mx-auto font-medium text-center mt-6">
                    Where ideas turn to{" "} 
                    <span className="text-blue-400">reality</span>
                </h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-8">
                    <FeatureCard 
                        title="Collaboration" 
                        description="Work together with conflict free scheduling"
                        className="md:col-span-2 lg:col-span-1"
                    >
                        <Image 
                            src={collaborationImage}
                            alt="collaboration"
                            className="aspect-video"

                        />
                    </FeatureCard>
                    <FeatureCard 
                        title="Kanban board" 
                        description="Drag and drop all your tasks with kanban"
                        className="md:col-span-2 lg:col-span-1"
                    >
                        <Image 
                            src={kanbanImage}
                            alt="kanban feature"
                            className="aspect-video"
                        />
                    </FeatureCard>
                    <FeatureCard 
                        title="Team roles" 
                        description="Specify roles for team members"
                        className="md:col-span-2 md:col-start-2 lg:col-span-1"
                    >
                        <Image 
                            src={rolesImage}
                            alt="roles"
                            className="aspect-video"

                        />
                    </FeatureCard>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    {featuresList.map((feature) => (
                        <div key={feature} className="bg-neutral-900 border border-white/10 inline-flex items-center gap-3 px-3 md:px-5 md:py-2 py-1.5 rounded-xl">
                            <span className="bg-blue-500 text-neutral-950 size-5 rounded-full inline-flex items-center justify-center">&#10038;</span>
                            <span className="font-medium md:text-lg">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}