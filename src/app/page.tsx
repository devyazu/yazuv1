import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginScreen } from "@/components/LoginScreen";

type PageProps = { searchParams: { callbackUrl?: string; verified?: string } };

export default async function HomePage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <LoginScreen
      callbackUrl={searchParams.callbackUrl ?? null}
      verified={searchParams.verified === "1"}
    />
  );
}
