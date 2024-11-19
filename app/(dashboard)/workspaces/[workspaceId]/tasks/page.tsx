import { auth } from "@/auth";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { redirect } from "next/navigation";



const TasksPage = async () => {
    
    const session = await auth();
    if(!session?.user) {
        redirect("/sign-in");
    };

    return ( 
        <div className="h-full flex flex-cols">  
            <TaskViewSwitcher />
        </div>
        
    );
}
 
export default TasksPage;