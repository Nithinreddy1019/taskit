import { AuthNav } from "./_components/auth-nav";

interface AuthLayoutProps {
    children: React.ReactNode;
}


const AuthLayout = ({
    children
}: AuthLayoutProps) => {
    return (
        <main className="min-h-screen">
            <div className="max-w-2xl mx-auto p-4">
                <AuthNav />
                <div className="flex flex-col items-center justify-center pt-4 md:pt-12">
                    {children}
                </div>
            </div>
        </main>
    );
}
 
export default AuthLayout;