import { ArrowRight } from "lucide-react"
import Image from "next/image";

import example1Image from "@/assets/example1Image.png";
import example2Image from "@/assets/example2Image.png";
import { Pointer } from "./pointer";


export const Hero = () => {
    return (
        <section className="py-24 overflow-x-clip">
            <div className="container relative">
                <div className="absolute top-16 -left-20 hidden lg:block">
                    <Image 
                        src={example1Image}
                        alt="example one"
                        width={210}
                        height={360}
                    />
                </div>
                <div className="absolute -right-64 -top-16 hidden lg:block">
                    <Image 
                        src={example2Image}
                        alt="example two"
                        width={400}
                        height={440}
                    />
                </div>
                <div className="absolute left-48 top-80 hidden lg:block">
                    <Pointer name="workspace" color="blue"/>
                </div>
                <div className="absolute right-80 -top-4 hidden lg:block">
                    <Pointer name="tasks" color="red"/>
                </div>
                <div className="flex justify-center">
                    <div className="text-sm inline-flex py-1 px-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full text-neutral-950 font-semibold">
                        ✨Realtime updates
                    </div>
                </div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium text-center mt-6">
                    Manage all your projects, tasks effortlessly
                </h1>
                <p className="text-center text-xl text-white/50 mt-8 max-w-2xl mx-auto">
                    Beyond task management: Your personal collaborative workspace for turning ideas into reality.
                </p>

                <div className="flex justify-center mt-8">
                    <button className="flex items-center gap-x-2 border border-white/15 px-4 py-2 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-400 group text-neutral-950 font-medium">
                        <span className="">Try it now</span>
                        <ArrowRight className="size-4 group-hover:-rotate-45 transition"/>
                    </button>
                </div>
            </div>
        </section>
    )
}