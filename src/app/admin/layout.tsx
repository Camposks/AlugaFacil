import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.perfil !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        userName={session.user?.name || ""}
        userEmail={session.user?.email || ""}
      />
      <main className="flex-1 bg-gray-50 min-h-screen lg:ml-56">
        {children}
      </main>
    </div>
  );
}