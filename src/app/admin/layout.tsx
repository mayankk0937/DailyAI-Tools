import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in OR email is not the admin email, redirect to dashboard or home
  if (!user || user.email !== "mayank0522.s@gmail.com") {
    // Check if guest mode
    const isGuest = cookieStore.get("guest_mode")?.value === "true";
    if (isGuest && "mayank0522.s@gmail.com" === "mayank0522.s@gmail.com") {
       // Only allow guest mode if we just want to bypass for testing (optional logic)
       // Let's enforce strict email check for safety, redirect otherwise
       redirect("/dashboard");
    }
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 bg-gradient-to-br from-background to-background/50">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
