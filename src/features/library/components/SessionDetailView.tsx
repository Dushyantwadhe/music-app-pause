"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useHarmoniumStore } from "@/store/useHarmoniumStore";
import { useTablaStore } from "@/store/useTablaStore";
import { HarmoniumView } from "@/features/harmonium/components/HarmoniumView";
import { TablaView } from "@/features/tabla/components/TablaView";
import type { HarmoniumSessionCard, PracticeSessionCard, TablaSessionCard } from "@/types";

const AVAILABLE_CARDS = [
  {
    type: "harmonium" as const,
    title: "Harmonium",
    subtitle: "Keys, drone, transpose",
  },
  {
    type: "tabla" as const,
    title: "Tabla",
    subtitle: "Taal, BPM, groove",
  },
];

function cardTypeLabel(card: PracticeSessionCard) {
  return card.type === "harmonium" ? "Harmonium" : "Tabla";
}

interface SessionDetailViewProps {
  sessionId: string;
}

export function SessionDetailView({ sessionId }: SessionDetailViewProps) {
  const router = useRouter();
  const hasHydrated = useLibraryStore((state) => state.hasHydrated);
  const sessions = useLibraryStore((state) => state.sessions);
  const selectSession = useLibraryStore((state) => state.selectSession);
  const focusedCardId = useLibraryStore((state) => state.focusedCardId);
  const focusCard = useLibraryStore((state) => state.focusCard);
  const addSessionCard = useLibraryStore((state) => state.addSessionCard);
  const removeSessionCard = useLibraryStore((state) => state.removeSessionCard);
  const updateSession = useLibraryStore((state) => state.updateSession);
  const updateSessionCard = useLibraryStore((state) => state.updateSessionCard);
  const moveSessionCard = useLibraryStore((state) => state.moveSessionCard);
  const playSession = useLibraryStore((state) => state.playSession);
  const pauseSession = useLibraryStore((state) => state.pauseSession);
  const completeSession = useLibraryStore((state) => state.completeSession);

  const session = sessions.find((entry) => entry.id === sessionId);

  useEffect(() => {
    if (sessionId) {
      selectSession(sessionId);
    }
  }, [selectSession, sessionId]);

  if (!hasHydrated) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/" className="text-sm text-[#2563eb] hover:underline">
          ← Sessions
        </Link>
        <Card className="text-sm text-[#6b7280]">Loading session...</Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/" className="text-sm text-[#2563eb] hover:underline">
          ← Sessions
        </Link>
        <Card className="text-sm text-[#6b7280]">This session no longer exists.</Card>
      </div>
    );
  }

  const currentSession = session;

  const attachedCards = [...currentSession.cards].sort((left, right) => left.order - right.order);
  const focusedCard = attachedCards.find((card) => card.id === focusedCardId) ?? attachedCards[0] ?? null;
  const cardByType = new Map(attachedCards.map((card) => [card.type, card] as const));

  function handleOpenTool(type: PracticeSessionCard["type"]) {
    const existing = cardByType.get(type);
    if (existing) {
      if (existing.type === "harmonium" && existing.config.autoEnableDrone) {
        updateSessionCard(currentSession.id, existing.id, {
          config: {
            ...existing.config,
            autoEnableDrone: false,
          },
        } as Partial<HarmoniumSessionCard>);
      }
      if (existing.type === "tabla" && existing.config.autoPlay) {
        updateSessionCard(currentSession.id, existing.id, {
          config: {
            ...existing.config,
            autoPlay: false,
          },
        } as Partial<TablaSessionCard>);
      }
      focusCard(existing.id);
      if (!existing.enabled) {
        updateSessionCard(currentSession.id, existing.id, { enabled: true });
      }
      return;
    }
    addSessionCard(currentSession.id, type);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="text-sm text-[#2563eb] hover:underline">
          ← Sessions
        </Link>
        <div className="flex gap-2">
          <Button size="sm" variant="surface" onClick={() => pauseSession(currentSession.id)}>Pause</Button>
          <Button size="sm" onClick={() => playSession(currentSession.id)}>Play</Button>
        </div>
      </div>

      <Card className="p-2">
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_220px] md:items-start">
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-2">
              <input
                type="text"
                value={currentSession.name}
                onChange={(event) => updateSession(currentSession.id, { name: event.target.value, status: "draft" })}
                className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-base font-semibold text-[#111827] focus:border-[#d1d5db] focus:outline-none"
              />
              <Badge variant={currentSession.status === "playing" ? "primary" : currentSession.isTemplate ? "success" : "muted"}>
                {currentSession.status}
              </Badge>
            </div>

            <p className="mt-0.5 text-[11px] text-[#6b7280]">Session name visible at top while building and playing.</p>

            <textarea
              value={currentSession.description}
              onChange={(event) => updateSession(currentSession.id, { description: event.target.value, status: "draft" })}
              placeholder="Optional short description for this session"
              className="mt-1 min-h-11 w-full resize-none rounded border border-[#d1d5db] bg-white px-2 py-1.5 text-xs text-[#111827] placeholder:text-[#9ca3af] focus:outline-none"
            />
          </div>

          <div className="grid gap-1 text-[11px] text-[#6b7280]">
            <div className="rounded border border-[#d1d5db] p-1.5">
              <p>Attached items</p>
              <p className="mt-0.5 text-sm font-semibold text-[#111827]">{attachedCards.length}</p>
            </div>
            <div className="rounded border border-[#d1d5db] p-1.5">
              <p>Saved duration</p>
              <p className="mt-0.5 text-sm font-semibold text-[#111827]">{currentSession.durationMinutes} min</p>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-2 md:grid-cols-[200px_minmax(0,1fr)] md:items-start">
        <Card className="overflow-hidden p-0">
          <div className="px-2.5 py-1.5">
            <h2 className="text-xs font-semibold text-[#111827]">Tools</h2>
          </div>
          <div className="flex flex-col border-t border-[#d1d5db]">
            {AVAILABLE_CARDS.map((item) => {
              const card = cardByType.get(item.type);
              const isFocused = card?.id === focusedCard?.id;
              return (
                <div key={item.type} className="relative border-b border-[#d1d5db] last:border-b-0">
                  <button
                    type="button"
                    onClick={() => handleOpenTool(item.type)}
                    className={cn(
                      "w-full px-2.5 py-1.5 pr-7 text-left transition-colors",
                      isFocused ? "bg-[#eff6ff] text-[#1d4ed8]" : "bg-white text-[#111827] hover:bg-[#f9fafb]"
                    )}
                  >
                    <p className="text-sm font-semibold leading-tight">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-[#6b7280]">{card?.title || item.subtitle}</p>
                  </button>

                  {card ? (
                    <button
                      type="button"
                      aria-label={`Remove ${item.title} card`}
                      onClick={() => removeSessionCard(currentSession.id, card.id)}
                      className="absolute right-1.5 top-1.5 h-4.5 w-4.5 rounded border border-[#d1d5db] text-[#6b7280] hover:bg-[#f3f4f6]"
                    >
                      x
                    </button>
                  ) : (
                    <span className="absolute right-2.5 top-1 text-base leading-none text-[#111827]">+</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="flex flex-col gap-2 p-2">
          <div>
            <h2 className="text-sm font-semibold text-[#111827]">Tool Editor</h2>
            <p className="mt-0.5 text-[11px] text-[#6b7280]">Select a tool from the left to configure and record it.</p>
          </div>

          {focusedCard ? (
            focusedCard.type === "harmonium" ? (
              <HarmoniumCardPanel
                sessionId={currentSession.id}
                card={focusedCard}
                onUpdate={updateSessionCard}
              />
            ) : (
              <TablaCardPanel
                sessionId={currentSession.id}
                card={focusedCard}
                onUpdate={updateSessionCard}
              />
            )
          ) : (
            <div className="rounded border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#6b7280]">
              Add a tool from the left rail to start building this session.
            </div>
          )}

        </Card>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5">
        <Button variant="ghost" onClick={() => router.push("/")}>Back to Home</Button>
        <div className="flex flex-wrap items-center gap-1.5">
        <Button variant="surface" onClick={() => updateSession(currentSession.id, { status: "saved" })}>Save Session</Button>
        <Button variant="outline" onClick={() => completeSession(currentSession.id)}>Complete</Button>
        </div>
      </div>
    </div>
  );
}

interface HarmoniumCardPanelProps {
  sessionId: string;
  card: HarmoniumSessionCard;
  onUpdate: (sessionId: string, cardId: string, patch: Partial<PracticeSessionCard>) => void;
}

function HarmoniumCardPanel({ sessionId, card, onUpdate }: HarmoniumCardPanelProps) {
  const applyConfig = useHarmoniumStore((state) => state.applyConfig);
  const volume = useHarmoniumStore((state) => state.volume);
  const sustain = useHarmoniumStore((state) => state.sustain);
  const octave = useHarmoniumStore((state) => state.octave);
  const transpose = useHarmoniumStore((state) => state.transpose);
  const drone = useHarmoniumStore((state) => state.drone);

  useEffect(() => {
    applyConfig(card.config);
  }, [applyConfig, card.id]);

  useEffect(() => {
    const hasChanged =
      card.config.volume !== volume ||
      card.config.sustain !== sustain ||
      card.config.octave !== octave ||
      card.config.transpose !== transpose ||
      card.config.drone !== drone;

    if (!hasChanged) return;

    onUpdate(sessionId, card.id, {
      config: {
        ...card.config,
        volume,
        sustain,
        octave,
        transpose,
        drone,
      },
    } as Partial<HarmoniumSessionCard>);
  }, [
    card.config,
    card.id,
    drone,
    octave,
    onUpdate,
    sessionId,
    sustain,
    transpose,
    volume,
  ]);

  return (
    <Card className="flex flex-col gap-2 p-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-[#6b7280]">Harmonium</p>
          <input
            type="text"
            value={card.title}
            onChange={(event) => onUpdate(sessionId, card.id, { title: event.target.value })}
            className="mt-0.5 w-full rounded border border-[#d1d5db] bg-white px-2 py-1 text-sm font-semibold text-[#111827] focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded border border-[#d1d5db] bg-white">
        <HarmoniumView />
      </div>
    </Card>
  );
}

interface TablaCardPanelProps {
  sessionId: string;
  card: TablaSessionCard;
  onUpdate: (sessionId: string, cardId: string, patch: Partial<PracticeSessionCard>) => void;
}

function TablaCardPanel({ sessionId, card, onUpdate }: TablaCardPanelProps) {
  const applyConfig = useTablaStore((state) => state.applyConfig);
  const selectedTaal = useTablaStore((state) => state.selectedTaal);
  const bpm = useTablaStore((state) => state.bpm);
  const pitch = useTablaStore((state) => state.pitch);
  const isLooping = useTablaStore((state) => state.isLooping);
  const mode = useTablaStore((state) => state.mode);
  const countInBeats = useTablaStore((state) => state.countInBeats);
  const patternLayer = useTablaStore((state) => state.patternLayer);
  const stylePackId = useTablaStore((state) => state.stylePackId);
  const variantId = useTablaStore((state) => state.variantId);
  const thaatContext = useTablaStore((state) => state.thaatContext);
  const presetSlots = useTablaStore((state) => state.presetSlots);

  useEffect(() => {
    applyConfig(card.config);
  }, [applyConfig, card.id]);

  useEffect(() => {
    const hasChanged =
      card.config.taalName !== selectedTaal ||
      card.config.bpm !== bpm ||
      card.config.pitch !== pitch ||
      card.config.isLooping !== isLooping ||
      card.config.mode !== mode ||
      card.config.countInBeats !== countInBeats ||
      card.config.patternLayer !== patternLayer ||
      card.config.stylePackId !== stylePackId ||
      card.config.variantId !== variantId ||
      card.config.thaatContext !== thaatContext ||
      JSON.stringify(card.config.presetSlots ?? [null, null, null]) !== JSON.stringify(presetSlots) ||
      card.config.isMetronomeMode !== (mode === "metronome");

    if (!hasChanged) return;

    onUpdate(sessionId, card.id, {
      config: {
        ...card.config,
        taalName: selectedTaal,
        bpm,
        pitch,
        isLooping,
        mode,
        countInBeats,
        patternLayer,
        stylePackId,
        variantId,
        thaatContext,
        presetSlots,
        isMetronomeMode: mode === "metronome",
        autoPlay: false,
      },
    } as Partial<TablaSessionCard>);
  }, [
    bpm,
    card.config,
    countInBeats,
    card.id,
    isLooping,
    mode,
    onUpdate,
    patternLayer,
    pitch,
    presetSlots,
    selectedTaal,
    sessionId,
    stylePackId,
    thaatContext,
    variantId,
  ]);

  return (
    <Card className="flex flex-col gap-2 p-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-[#6b7280]">Tabla</p>
          <input
            type="text"
            value={card.title}
            onChange={(event) => onUpdate(sessionId, card.id, { title: event.target.value })}
            className="mt-0.5 w-full rounded border border-[#d1d5db] bg-white px-2 py-1 text-sm font-semibold text-[#111827] focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded border border-[#d1d5db] bg-white">
        <TablaView />
      </div>
    </Card>
  );
}
