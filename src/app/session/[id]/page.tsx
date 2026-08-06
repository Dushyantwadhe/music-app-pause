import { AppShell } from "@/components/layout/AppShell";
import { SessionDetailView } from "@/features/library/components/SessionDetailView";

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <SessionDetailView sessionId={id} />
    </AppShell>
  );
}
