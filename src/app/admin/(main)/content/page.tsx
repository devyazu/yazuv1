import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ContentManager } from "./ContentManager";

export default async function AdminContentPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-foreground mb-2">İçerik yönetimi</h1>
      <p className="text-muted mb-6">
        Ana sayfadaki bölümleri düzenleyin, sıralayın veya yeni bölüm ekleyin.
      </p>
      <ContentManager />
    </div>
  );
}
