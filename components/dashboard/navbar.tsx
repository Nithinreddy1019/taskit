import { MobileSidebar } from "./mobile-sidebar"
import { UserButton } from "./user-button"


    export const Navbar = () => {
        return (
            <nav className="pt-4 px-6 flex items-center justify-between w-full">
                <div className="hidden lg:flex flex-col">
                    <h1 className="text-2xl font-semibold">Home</h1>
                    <p className="text-muted-foreground">Monitor all your tasks and projects here.</p>
                </div>

                <MobileSidebar />
                <UserButton />
            </nav>
        )
    }