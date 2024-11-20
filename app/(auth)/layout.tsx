import { AuthNav } from "../../features/auth/components/auth-nav";

interface AuthLayoutProps {
    children: React.ReactNode;
}


const AuthLayout = ({
    children
}: AuthLayoutProps) => {
    return (
        <main className="min-h-screen dark:bg-[#141414]">
            <div className="max-w-2xl mx-auto p-4">
                <div className="flex flex-col items-center justify-center pt-4 md:pt-6">
                    {children}
                </div>
            </div>
        </main>
    );
}
 
export default AuthLayout;