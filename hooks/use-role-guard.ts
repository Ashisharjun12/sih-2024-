import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRoleGuard(allowedRole: string) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
      return;
    }

    if (session.user.role !== allowedRole) {
      router.push("/");
    }
  }, [session, status, allowedRole, router]);

  return { session, status };
} 