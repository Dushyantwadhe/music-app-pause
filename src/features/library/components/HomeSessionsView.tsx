"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, Badge } from "@/components/ui/Card";
import { useLibraryStore } from "@/store/useLibraryStore";
import { cn } from "@/lib/cn";
import { STARTER_SESSIONS, type StarterSessionId } from "@/features/library/data/starterSessions";

function formatSavedTime(value: Date | string) {
  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPracticeMinutes(seconds: number) {
  return `${Math.floor(seconds / 60)} min practised`;
}

export function HomeSessionsView() {
  const router = useRouter();
  const hasHydrated = useLibraryStore((state) => state.hasHydrated);
  const sessions = useLibraryStore((state) => state.sessions);
  const createSession = useLibraryStore((state) => state.createSession);
  const createStarterSession = useLibraryStore((state) => state.createStarterSession);
  const deleteSession = useLibraryStore((state) => state.deleteSession);
  const playSession = useLibraryStore((state) => state.playSession);

  const sortedSessions = [...sessions].sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
  );
  const continueSession = sortedSessions.find((session) => session.status === "paused" || session.status === "playing")
    ?? sortedSessions[0];

  function handleCreateSession() {
    const id = createSession();
    router.push(`/session/${id}`);
  }

  function handleStartTemplate(templateId: StarterSessionId) {
    const id = createStarterSession(templateId);
    router.push(`/session/${id}`);
  }

  function handleDeleteSession(event: React.MouseEvent<HTMLButtonElement>, id: string, name: string) {
    event.preventDefault();
    event.stopPropagation();
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
    deleteSession(id);
  }

  function handleContinueSession(id: string) {
    playSession(id);
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
          <Card className="p-4">
            <div className="max-w-xl">
              <p className="text-base font-semibold text-[#111827]">Start your first riyaaz</p>
              <p className="mt-1 text-sm text-[#6b7280]">
                Pick a simple practice flow. You can adjust every setting after it opens.
              </p>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              {STARTER_SESSIONS.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => handleStartTemplate(session.id)}
                  className="rounded border border-[#d1d5db] bg-white p-3 text-left transition-colors hover:border-[#c89c5d] hover:bg-[#f7f0e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a5a2b]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#111827]">{session.title}</p>
                    <span className="shrink-0 text-[11px] font-medium text-[#8a5a2b]">{session.duration}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#6b7280]">{session.description}</p>
                  <span className="mt-3 inline-flex text-xs font-medium text-[#8a5a2b]">Start {session.instrument} →</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-[#6b7280]">Already know what you need?</span>
              <Button size="sm" variant="outline" onClick={handleCreateSession}>Create blank session</Button>
            </div>
          </Card>
        ) : (
          <>
            {continueSession && (
              <Card className="border-[#d9c8ae] bg-[#f7f0e2] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[#8a5a2b]">Continue practice</p>
                    <h2 className="mt-1 truncate text-base font-semibold text-[#111827]">{continueSession.name}</h2>
                    <p className="mt-1 text-xs text-[#6b7280]">
                      {continueSession.description || `${continueSession.cards.length} practice tools`} · {continueSession.durationMinutes} min
                    </p>
                  </div>
                  <Button onClick={() => handleContinueSession(continueSession.id)}>
                    {continueSession.status === "paused" ? "Resume" : "Start practice"}
                  </Button>
                </div>
              </Card>
            )}
            <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[#6b7280]">Your sessions</p>
            {sortedSessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "relative rounded border border-[#d1d5db] bg-white",
                "transition-colors hover:bg-[#f9fafb]"
              )}
            >
              <Link href={`/session/${session.id}`} className="block px-3 py-2 pr-20">
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
                    <span>{formatPracticeMinutes(session.actualPracticeSeconds ?? 0)}</span>
                    <span>•</span>
                    <span>{formatSavedTime(session.updatedAt)}</span>
                  </div>
                </div>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={(event) => handleDeleteSession(event, session.id, session.name)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#b91c1c] hover:bg-[#fef2f2] hover:text-[#b91c1c]"
              >
                Delete
              </Button>
            </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
