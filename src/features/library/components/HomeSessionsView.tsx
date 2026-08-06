"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, Badge } from "@/components/ui/Card";
import { useLibraryStore } from "@/store/useLibraryStore";
import { cn } from "@/lib/cn";

function formatSavedTime(value: Date | string) {
  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HomeSessionsView() {
  const router = useRouter();
  const hasHydrated = useLibraryStore((state) => state.hasHydrated);
  const sessions = useLibraryStore((state) => state.sessions);
  const createSession = useLibraryStore((state) => state.createSession);

  const sortedSessions = [...sessions].sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
  );

  function handleCreateSession() {
    const id = createSession();
    router.push(`/session/${id}`);
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#111827]">Saved Sessions</h1>
          <p className="text-xs text-[#6b7280]">Pick a saved session or create a new one.</p>
        </div>
        <Button size="sm" onClick={handleCreateSession}>New Session</Button>
      </div>

      <div className="flex flex-col gap-2">
        {!hasHydrated ? (
          <Card className="py-6 text-center text-sm text-[#6b7280]">
            Loading sessions...
          </Card>
        ) : sortedSessions.length === 0 ? (
          <Card className="py-6 text-center text-sm text-[#6b7280]">
            No sessions yet. Create your first practice flow.
          </Card>
        ) : (
          sortedSessions.map((session) => (
            <Link
              key={session.id}
              href={`/session/${session.id}`}
              className={cn(
                "rounded border border-[#d1d5db] bg-white px-3 py-2",
                "transition-colors hover:bg-[#f9fafb]"
              )}
            >
              <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-sm font-semibold text-[#111827]">{session.name}</h2>
                    {session.isTemplate && <Badge variant="success">Template</Badge>}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-[#6b7280]">
                    {session.description || "No description"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#6b7280] md:justify-end">
                  <span>{session.cards.length} items</span>
                  <span>•</span>
                  <span>{session.durationMinutes} min</span>
                  <span>•</span>
                  <span>{formatSavedTime(session.updatedAt)}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
