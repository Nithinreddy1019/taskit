import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { UpdateTaskModal } from "@/features/tasks/components/update-task-modal";
import { CreateWorkSpcaeModal } from "@/features/workspaces/components/create-workspace-modal";

interface DashboardLayoutProps {
    children: React.ReactNode
}

const DashboardLayout = ({
    children
}: DashboardLayoutProps) => {
    return (
        <div className="min-h-screen">
            <CreateWorkSpcaeModal />
            <CreateProjectModal />
            <CreateTaskModal />
            <UpdateTaskModal />
            <div className="flex w-full h-full">
                <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
                    <Sidebar />
                </div>
                <div className="lg:pl-[264px] w-full">
                    <div className="mx-auto max-w-screen-2xl h-full">
                        <Navbar />
                        <main className="h-full px-6 py-8 flex flex-col">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default DashboardLayout;