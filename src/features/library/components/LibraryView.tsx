"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, Card, SectionHeader } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { cn } from "@/lib/cn";
import { useLibraryStore } from "@/store/useLibraryStore";
import type {
  HarmoniumSessionCard,
  PracticeSession,
  PracticeSessionCard,
  Recording,
  SessionStatus,
  TablaSessionCard,
  TaalName,
} from "@/types";

const STATUS_TONE: Record<SessionStatus, "primary" | "success" | "muted"> = {
  draft: "muted",
  saved: "success",
  playing: "primary",
  paused: "muted",
  completed: "success",
};

const DRONE_OPTIONS = ["off", "sa", "pa", "sa+pa"] as const;
const TAAL_OPTIONS: TaalName[] = ["Teentaal", "Dadra", "Keharwa", "Rupak", "Ektaal"];

function formatDate(value: Date | string | null) {
  if (!value) return "Never played";
  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function cardLabel(card: PracticeSessionCard) {
  return card.type === "harmonium" ? "Harmonium" : "Tabla";
}

interface RecordingCardProps {
  recording: Recording;
}

function RecordingCard({ recording }: RecordingCardProps) {
  const { toggleFavorite, deleteRecording, playingId, setPlayingId } = useLibraryStore();
  const isPlaying = playingId === recording.id;
  const mins = Math.floor(recording.durationSeconds / 60).toString().padStart(2, "0");
  const secs = (recording.durationSeconds % 60).toString().padStart(2, "0");

  return (
    <div
      className={cn(
        "rounded-xl border p-3 flex items-center gap-3 transition-all duration-150",
        isPlaying
          ? "border-[#F59E0B]/50 bg-[#F59E0B]/5"
          : "border-[#334155] bg-[#1E293B]"
      )}
    >
      <button
        type="button"
        onClick={() => setPlayingId(isPlaying ? null : recording.id)}
        aria-label={isPlaying ? "Pause recording" : "Play recording"}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-150",
          isPlaying
            ? "bg-[#F59E0B] text-[#0F172A]"
            : "bg-[#273548] text-[#94A3B8] hover:bg-[#334155]"
        )}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#F8FAFC] truncate">{recording.name}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-[#64748B]">{new Date(recording.createdAt).toLocaleDateString()}</span>
          <span className="text-xs font-mono text-[#64748B]">{mins}:{secs}</span>
          <Badge variant="muted">{recording.instrument}</Badge>
        </div>
        {isPlaying && recording.blobUrl && (
          <audio
            src={recording.blobUrl}
            autoPlay
            controls
            onEnded={() => setPlayingId(null)}
            className="mt-2 h-8 w-full rounded-lg"
          />
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => toggleFavorite(recording.id)}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-colors duration-150",
            recording.isFavorite ? "text-[#F59E0B]" : "text-[#334155] hover:text-[#64748B]"
          )}
          aria-label={recording.isFavorite ? "Unfavorite recording" : "Favorite recording"}
        >
          {recording.isFavorite ? "★" : "☆"}
        </button>
        <button
          type="button"
          onClick={() => deleteRecording(recording.id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#334155] hover:text-[#EF4444] transition-colors duration-150"
          aria-label="Delete recording"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

interface SessionListItemProps {
  session: PracticeSession;
  selected: boolean;
}

function SessionListItem({ session, selected }: SessionListItemProps) {
  const { selectSession, playSession, pauseSession, completeSession, duplicateSession, deleteSession } = useLibraryStore();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => selectSession(session.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectSession(session.id);
        }
      }}
      className={cn(
        "rounded-2xl border p-4 transition-all duration-150 cursor-pointer",
        selected
          ? "border-[#F59E0B] bg-[#F59E0B]/8"
          : "border-[#334155] bg-[#1E293B] hover:border-[#475569]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[#F8FAFC] truncate">{session.name}</h3>
            <Badge variant={STATUS_TONE[session.status]}>{session.status}</Badge>
          </div>
          <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{session.description || "No description yet."}</p>
        </div>
        <Badge variant="muted">{session.cards.length} cards</Badge>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap text-[11px] text-[#64748B]">
        <span>{session.durationMinutes} min</span>
        <span>•</span>
        <span>{formatDate(session.lastPlayedAt)}</span>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <Button
          size="sm"
          onClick={(event) => {
            event.stopPropagation();
            playSession(session.id);
          }}
        >
          {session.status === "playing" ? "Replay" : "Play Session"}
        </Button>
        <Button
          size="sm"
          variant="surface"
          onClick={(event) => {
            event.stopPropagation();
            pauseSession(session.id);
          }}
        >
          Pause
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(event) => {
            event.stopPropagation();
            completeSession(session.id);
          }}
        >
          Complete
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(event) => {
            event.stopPropagation();
            duplicateSession(session.id);
          }}
        >
          Duplicate
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={(event) => {
            event.stopPropagation();
            deleteSession(session.id);
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

interface HarmoniumCardEditorProps {
  sessionId: string;
  card: HarmoniumSessionCard;
}

function HarmoniumCardEditor({ sessionId, card }: HarmoniumCardEditorProps) {
  const updateSessionCard = useLibraryStore((state) => state.updateSessionCard);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Slider
          label="Volume"
          value={Math.round(card.config.volume * 100)}
          min={0}
          max={100}
          onChange={(value) => updateSessionCard(sessionId, card.id, {
            config: { ...card.config, volume: value / 100 },
          } as Partial<HarmoniumSessionCard>)}
          formatValue={(value) => `${value}%`}
        />
        <Slider
          label="Sustain"
          value={Math.round(card.config.sustain * 100)}
          min={0}
          max={100}
          onChange={(value) => updateSessionCard(sessionId, card.id, {
            config: { ...card.config, sustain: value / 100 },
          } as Partial<HarmoniumSessionCard>)}
          formatValue={(value) => `${value}%`}
        />
        <Slider
          label="Octave"
          value={card.config.octave}
          min={2}
          max={6}
          onChange={(value) => updateSessionCard(sessionId, card.id, {
            config: { ...card.config, octave: value },
          } as Partial<HarmoniumSessionCard>)}
          formatValue={(value) => `Oct ${value}`}
        />
        <Slider
          label="Transpose"
          value={card.config.transpose}
          min={-6}
          max={6}
          onChange={(value) => updateSessionCard(sessionId, card.id, {
            config: { ...card.config, transpose: value },
          } as Partial<HarmoniumSessionCard>)}
          formatValue={(value) => (value === 0 ? "0" : value > 0 ? `+${value}` : `${value}`)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {DRONE_OPTIONS.map((drone) => (
          <Button
            key={drone}
            size="sm"
            variant={card.config.drone === drone ? "primary" : "outline"}
            onClick={() => updateSessionCard(sessionId, card.id, {
              config: { ...card.config, drone },
            } as Partial<HarmoniumSessionCard>)}
          >
            {drone}
          </Button>
        ))}
      </div>

      <label className="flex items-center justify-between gap-3 rounded-xl border border-[#334155] px-3 py-2">
        <span>
          <span className="block text-sm text-[#F8FAFC]">Auto-enable drone</span>
          <span className="block text-xs text-[#64748B]">Start drone immediately when session plays.</span>
        </span>
        <input
          type="checkbox"
          checked={card.config.autoEnableDrone}
          onChange={(event) => updateSessionCard(sessionId, card.id, {
            config: { ...card.config, autoEnableDrone: event.target.checked },
          } as Partial<HarmoniumSessionCard>)}
          className="h-4 w-4 accent-[#F59E0B]"
        />
      </label>
    </div>
  );
}

interface TablaCardEditorProps {
  sessionId: string;
  card: TablaSessionCard;
}

function TablaCardEditor({ sessionId, card }: TablaCardEditorProps) {
  const updateSessionCard = useLibraryStore((state) => state.updateSessionCard);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Slider
          label="BPM"
          value={card.config.bpm}
          min={40}
          max={240}
          onChange={(value) => updateSessionCard(sessionId, card.id, {
            config: { ...card.config, bpm: value },
          } as Partial<TablaSessionCard>)}
          formatValue={(value) => `${value} BPM`}
        />
        <Slider
          label="Pitch"
          value={card.config.pitch}
          min={-6}
          max={6}
          onChange={(value) => updateSessionCard(sessionId, card.id, {
            config: { ...card.config, pitch: value },
          } as Partial<TablaSessionCard>)}
          formatValue={(value) => (value === 0 ? "0" : value > 0 ? `+${value}` : `${value}`)}
        />
      </div>

      <div>
        <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-2">Taal</p>
        <div className="flex gap-2 flex-wrap">
          {TAAL_OPTIONS.map((taal) => (
            <Button
              key={taal}
              size="sm"
              variant={card.config.taalName === taal ? "primary" : "outline"}
              onClick={() => updateSessionCard(sessionId, card.id, {
                config: { ...card.config, taalName: taal },
              } as Partial<TablaSessionCard>)}
            >
              {taal}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="flex items-center justify-between gap-3 rounded-xl border border-[#334155] px-3 py-2">
          <span className="text-sm text-[#F8FAFC]">Loop</span>
          <input
            type="checkbox"
            checked={card.config.isLooping}
            onChange={(event) => updateSessionCard(sessionId, card.id, {
              config: { ...card.config, isLooping: event.target.checked },
            } as Partial<TablaSessionCard>)}
            className="h-4 w-4 accent-[#F59E0B]"
          />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-xl border border-[#334155] px-3 py-2">
          <span className="text-sm text-[#F8FAFC]">Metronome</span>
          <input
            type="checkbox"
            checked={card.config.isMetronomeMode}
            onChange={(event) => updateSessionCard(sessionId, card.id, {
              config: { ...card.config, isMetronomeMode: event.target.checked },
            } as Partial<TablaSessionCard>)}
            className="h-4 w-4 accent-[#F59E0B]"
          />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-xl border border-[#334155] px-3 py-2">
          <span className="text-sm text-[#F8FAFC]">Auto-play</span>
          <input
            type="checkbox"
            checked={card.config.autoPlay}
            onChange={(event) => updateSessionCard(sessionId, card.id, {
              config: { ...card.config, autoPlay: event.target.checked },
            } as Partial<TablaSessionCard>)}
            className="h-4 w-4 accent-[#F59E0B]"
          />
        </label>
      </div>
    </div>
  );
}

interface SessionCardEditorProps {
  sessionId: string;
  card: PracticeSessionCard;
  totalCards: number;
}

function SessionCardEditor({ sessionId, card, totalCards }: SessionCardEditorProps) {
  const updateSessionCard = useLibraryStore((state) => state.updateSessionCard);
  const moveSessionCard = useLibraryStore((state) => state.moveSessionCard);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="muted">{cardLabel(card)}</Badge>
            <input
              type="text"
              value={card.title}
              onChange={(event) => updateSessionCard(sessionId, card.id, { title: event.target.value })}
              className="bg-transparent text-sm font-semibold text-[#F8FAFC] focus:outline-none border-b border-transparent focus:border-[#F59E0B]"
            />
          </div>
          <p className="text-xs text-[#64748B] mt-1">Order {card.order + 1} of {totalCards}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <input
              type="checkbox"
              checked={card.enabled}
              onChange={(event) => updateSessionCard(sessionId, card.id, { enabled: event.target.checked })}
              className="h-4 w-4 accent-[#F59E0B]"
            />
            Enabled
          </label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => moveSessionCard(sessionId, card.id, "up")}
            disabled={card.order === 0}
          >
            Up
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => moveSessionCard(sessionId, card.id, "down")}
            disabled={card.order === totalCards - 1}
          >
            Down
          </Button>
        </div>
      </div>

      {card.type === "harmonium" ? (
        <HarmoniumCardEditor sessionId={sessionId} card={card} />
      ) : (
        <TablaCardEditor sessionId={sessionId} card={card} />
      )}
    </Card>
  );
}

export function LibraryView() {
  const {
    recordings,
    sessions,
    selectedSessionId,
    searchQuery,
    filterMode,
    createSession,
    selectSession,
    updateSession,
    setSearchQuery,
    setFilterMode,
    playSession,
    pauseSession,
    completeSession,
  } = useLibraryStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = !localSearch || [session.name, session.description]
      .join(" ")
      .toLowerCase()
      .includes(localSearch.toLowerCase());

    const matchesFilter =
      filterMode === "all" ||
      (filterMode === "recent" && !!session.lastPlayedAt) ||
      (filterMode === "favorites" && session.isTemplate);

    return matchesSearch && matchesFilter;
  });

  const selectedSession =
    sessions.find((session) => session.id === selectedSessionId) ?? sessions[0] ?? null;

  useEffect(() => {
    if (!selectedSessionId && sessions[0]) {
      selectSession(sessions[0].id);
    }
  }, [selectedSessionId, selectSession, sessions]);

  const orderedCards = selectedSession
    ? [...selectedSession.cards].sort((left, right) => left.order - right.order)
    : [];

  function handleSearch(query: string) {
    setLocalSearch(query);
    setSearchQuery(query);
  }

  return (
    <div className="flex flex-col gap-5 p-4 max-w-6xl mx-auto w-full">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-[#F8FAFC] tracking-tight">Practice Sessions</h1>
          <p className="text-xs text-[#64748B]">Create a reusable practice recipe, save it, and replay it any time.</p>
        </div>
        <Button size="md" onClick={() => createSession()}>+ New Session</Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <Card>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]">🔍</span>
              <input
                type="search"
                value={localSearch}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search sessions..."
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-9 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#F59E0B] transition-colors"
              />
            </div>

            <div className="flex gap-2 mt-3 flex-wrap">
              {(["all", "recent", "favorites"] as const).map((mode) => (
                <Button
                  key={mode}
                  size="sm"
                  variant={filterMode === mode ? "primary" : "outline"}
                  onClick={() => setFilterMode(mode)}
                  className="capitalize"
                >
                  {mode === "favorites" ? "templates" : mode}
                </Button>
              ))}
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            {filteredSessions.length === 0 ? (
              <Card className="text-sm text-[#64748B]">No sessions match this filter.</Card>
            ) : (
              filteredSessions.map((session) => (
                <SessionListItem
                  key={session.id}
                  session={session}
                  selected={session.id === selectedSession?.id}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          {selectedSession ? (
            <>
              <Card className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <input
                      type="text"
                      value={selectedSession.name}
                      onChange={(event) => updateSession(selectedSession.id, {
                        name: event.target.value,
                        status: "draft",
                      })}
                      className="w-full bg-transparent text-xl font-semibold text-[#F8FAFC] focus:outline-none"
                    />
                    <textarea
                      value={selectedSession.description}
                      onChange={(event) => updateSession(selectedSession.id, {
                        description: event.target.value,
                        status: "draft",
                      })}
                      placeholder="Describe how this session should feel or when it is used."
                      className="mt-2 w-full min-h-20 resize-none rounded-xl border border-[#334155] bg-[#0F172A] px-3 py-2 text-sm text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 items-start sm:items-end">
                    <Badge variant={STATUS_TONE[selectedSession.status]}>{selectedSession.status}</Badge>
                    <span className="text-xs text-[#64748B]">Last played: {formatDate(selectedSession.lastPlayedAt)}</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Slider
                    label="Session Duration"
                    value={selectedSession.durationMinutes}
                    min={5}
                    max={120}
                    step={5}
                    onChange={(value) => updateSession(selectedSession.id, {
                      durationMinutes: value,
                      status: "draft",
                    })}
                    formatValue={(value) => `${value} min`}
                  />
                  <label className="flex items-center justify-between gap-3 rounded-xl border border-[#334155] px-3 py-2 h-fit self-end">
                    <span>
                      <span className="block text-sm text-[#F8FAFC]">Save as template</span>
                      <span className="block text-xs text-[#64748B]">Use this as a reusable starting preset.</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={selectedSession.isTemplate}
                      onChange={(event) => updateSession(selectedSession.id, {
                        isTemplate: event.target.checked,
                        status: "draft",
                      })}
                      className="h-4 w-4 accent-[#F59E0B]"
                    />
                  </label>
                </div>

                <textarea
                  value={selectedSession.notes}
                  onChange={(event) => updateSession(selectedSession.id, {
                    notes: event.target.value,
                    status: "draft",
                  })}
                  placeholder="Practice notes, goals, bandish, or teacher reminders..."
                  className="w-full min-h-24 resize-none rounded-xl border border-[#334155] bg-[#0F172A] px-3 py-2 text-sm text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#F59E0B]"
                />

                <div className="flex gap-2 flex-wrap">
                  <Button onClick={() => playSession(selectedSession.id)}>Play Session</Button>
                  <Button variant="surface" onClick={() => pauseSession(selectedSession.id)}>Pause</Button>
                  <Button variant="outline" onClick={() => completeSession(selectedSession.id)}>Complete</Button>
                  <Button
                    variant="ghost"
                    onClick={() => updateSession(selectedSession.id, { status: "saved" })}
                  >
                    Mark Saved
                  </Button>
                </div>
              </Card>

              <div>
                <SectionHeader
                  title="Instrument Cards"
                  subtitle="Ordered building blocks that define how the session starts."
                />
                <div className="flex flex-col gap-4">
                  {orderedCards.map((card) => (
                    <SessionCardEditor
                      key={card.id}
                      sessionId={selectedSession.id}
                      card={card}
                      totalCards={orderedCards.length}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Card className="text-sm text-[#64748B]">Create your first session to begin.</Card>
          )}

          <div>
            <SectionHeader
              title="Recent Recordings"
              subtitle="Session flow first, recordings remain attached to your practice history."
            />
            {recordings.length === 0 ? (
              <Card className="text-sm text-[#64748B]">No recordings yet. Use the harmonium recorder and attach recordings to your practice flow later.</Card>
            ) : (
              <div className="flex flex-col gap-2">
                {recordings.slice(0, 5).map((recording) => (
                  <RecordingCard key={recording.id} recording={recording} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
