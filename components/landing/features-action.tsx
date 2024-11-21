"use client"

import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, ValueAnimationTransition } from "motion/react";
import productImage from "@/assets/features.png";
import { LayoutDashboardIcon, MousePointer2Icon, SparklesIcon } from "lucide-react";

const tabs = [
    {
        icon: LayoutDashboardIcon,
        title: "User friendly dashboard",
        backgroundPositionX: 0,
        backgroundPositionY: 5,
        backgroundSizeX: 150
    },
    {
        icon: MousePointer2Icon,
        title: "Kanban board",
        backgroundPositionX: 80,
        backgroundPositionY: 100,
        backgroundSizeX: 135
    },
    {
        icon: SparklesIcon,
        title: "Views & filters",
        backgroundPositionX: 15,
        backgroundPositionY: 27,
        backgroundSizeX: 177
    }
];




export const FeaturesAction = () => {

    const [selectedTab, setSelectedTab] = useState(0);


    const backgroundPositionX = useMotionValue(tabs[0].backgroundPositionX);
    const backgroundPositionY = useMotionValue(tabs[0].backgroundPositionY);
    const backgroundSizeX = useMotionValue(tabs[0].backgroundSizeX);

    const backgroundSize = useMotionTemplate`${backgroundSizeX}% auto`;
    const backgroundPosition = useMotionTemplate`${backgroundPositionX}% ${backgroundPositionY}%`;


    const handleSelectTab = (index: number) => {
        setSelectedTab(index);

        const animateOptions: ValueAnimationTransition = {
            duration: 2,
            ease: "easeInOut"
        };

        animate(backgroundSizeX, [backgroundSizeX.get(), 200, tabs[index].backgroundSizeX], animateOptions);

        animate(backgroundPositionX, [backgroundPositionX.get(), tabs[index].backgroundPositionX], animateOptions);

        animate(backgroundPositionY, [backgroundPositionY.get(), tabs[index].backgroundPositionY], animateOptions);

    }
    
    return (
        <section className="my-24">
            <div className="container">
            <div className="mt-10 flex flex-col gap-3 lg:flex-row relative">
                {tabs.map((tab, tabIndex) => (
                    <FeaturesTab 
                    {...tab} 
                    key={tab.title} 
                    selected={selectedTab === tabIndex}
                    onClick={() => handleSelectTab(tabIndex)}
                />
                ))}
                </div>
                <div className="border border-white/20 p-2 rounded-xl mt-3">
                    <motion.div 
                        className="aspect-video bg-cover border border-white/10 rounded-lg"
                        style={{
                            backgroundImage: `url(${productImage.src})`,
                            backgroundPosition,
                            backgroundSize
                        }}
                    >
                    </motion.div>
                </div>
            </div>
        </section>
    )
};



const FeaturesTab = (props: typeof tabs[number] & ComponentPropsWithoutRef<'div'> & { selected: boolean }) => {

    const Icon = props.icon;

    const tabRef = useRef<HTMLDivElement>(null);

    const xPercentage = useMotionValue(0);
    const yPercentage = useMotionValue(0);

    const maskImage = useMotionTemplate`radial-gradient(80px 80px at ${xPercentage}% ${yPercentage}%,black,transparent)`

    useEffect(() => {
        if(!tabRef.current) return;

        xPercentage.set(0);
        yPercentage.set(0);

        const { height, width } = tabRef.current?.getBoundingClientRect();
        const circumference = height*2 + width*2;

        const times = [0, width/circumference, (width + height) / circumference ,(width*2 + height)/ circumference ,1]

        const options: ValueAnimationTransition = {
            times,
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
        }

        animate(xPercentage, [0, 100, 100, 0, 0], options);
        animate(yPercentage, [0, 0, 100, 100, 0], options);
    }, [props.selected]);


    return (
        <div
            ref={tabRef}
            onClick={props.onClick}
            className="border border-white/10 flex items-center lg:flex-1 rounded-lg p-2 gap-2 bg-neutral-950 relative"
        >
            {props.selected && (
                <motion.div 
                    style={{
                        maskImage,
                    }}
                    className="absolute inset-0 -m-px rounded-xl border-2 border-blue-500"
                >
                </motion.div>
            )}
            <div className="h-10 w-10 border border-white/10 rounded-lg inline-flex items-center justify-center  bg-gradient-to-bl from-indigo-500 to-blue-500">
                <Icon className="size-5 stroke-2"/>
            </div>
            <div className="font-medium">{props.title}</div>
        </div>
    )
}