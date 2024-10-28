import { UserButton } from "@/components/dashboard/user-button";
import Image from "next/image";
import Link from "next/link";


interface StandaloneLayoutProps {
    children: React.ReactNode
};


const StandaloneLayout = ({
    children,
}: StandaloneLayoutProps) => {
    return (
        <main className="bg-neutral-300 dark:bg-neutral-800 min-h-screen">
            <div className="max-w-screen-2xl mx-auto p-4">
                <nav className="flex justify-between items-center py-2">
                    <Link href={"/home"}>
                        <Image 
                            src={"/logo.svg"}
                            alt="logo"
                            height={35}
                            width={35}
                        />
                    </Link>
                    <UserButton />
                </nav>
                <div className="flex flex-col items-center justify-center py-4">
                    {children}
                </div>
            </div> 
        </main>
    );
}
 
export default StandaloneLayout;