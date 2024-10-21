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
                {children}
            </div>
        </main>
    );
}
 
export default AuthLayout;