"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data?.user) setAuthorized(true);
      } catch (error) {
        console.error("Not authorized", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-10 w-10 text-black" />
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
