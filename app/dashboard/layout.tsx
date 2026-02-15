import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="flex h-screen w-full overflow-hidden relative text-white">

            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none z-0" />


            <DashboardSidebar user={{
                name: session?.user?.name,
                email: session?.user?.email,
                image: session?.user?.image,
            }} />


            <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 w-full">
                <DashboardHeader user={{
                    name: session?.user?.name,
                    email: session?.user?.email,
                    image: session?.user?.image,
                }} />

                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-8 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}
