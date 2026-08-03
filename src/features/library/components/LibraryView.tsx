"use client";

import { useState } from "react";
import { useLibraryStore } from "@/store/useLibraryStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { Recording } from "@/types";

interface RecordingCardProps {
  recording: Recording;
}

function RecordingCard({ recording }: RecordingCardProps) {
  const { toggleFavorite, deleteRecording, playingId, setPlayingId } = useLibraryStore();
  const isPlaying = playingId === recording.id;

  const duration = recording.durationSeconds;
  const mins = Math.floor(duration / 60).toString().padStart(2, "0");
  const secs = (duration % 60).toString().padStart(2, "0");

  function handlePlayToggle() {
    if (isPlaying) {
      setPlayingId(null);
    } else {
      setPlayingId(recording.id);
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border p-3 flex items-center gap-3 transition-all duration-150",
        isPlaying
          ? "border-[#F59E0B]/50 bg-[#F59E0B]/5"
          : "border-[#334155] bg-[#1E293B] hover:border-[#475569]"
      )}
    >
      {/* Play button */}
      <button
        onClick={handlePlayToggle}
        aria-label={isPlaying ? "Pause" : "Play"}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
          "transition-all duration-150",
          isPlaying
            ? "bg-[#F59E0B] text-[#0F172A]"
            : "bg-[#273548] text-[#94A3B8] hover:bg-[#334155]"
        )}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#F8FAFC] truncate">{recording.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[#64748B]">
            {new Date(recording.createdAt).toLocaleDateString()}
          </span>
          <span className="text-xs font-mono text-[#64748B]">{mins}:{secs}</span>
          <Badge variant="muted">{recording.instrument}</Badge>
        </div>
        {/* Audio player if playing and blobUrl exists */}
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

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => toggleFavorite(recording.id)}
          aria-label={recording.isFavorite ? "Unfavorite" : "Favorite"}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg text-lg",
            "transition-colors duration-150",
            recording.isFavorite ? "text-[#F59E0B]" : "text-[#334155] hover:text-[#64748B]"
          )}
        >
          {recording.isFavorite ? "★" : "☆"}
        </button>
        <button
          onClick={() => deleteRecording(recording.id)}
          aria-label="Delete recording"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#334155] hover:text-[#EF4444] transition-colors duration-150"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function LibraryView() {
  const { recordings, searchQuery, setSearchQuery, filterMode, setFilterMode } = useLibraryStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  function handleSearch(q: string) {
    setLocalSearch(q);
    setSearchQuery(q);
  }

  const filtered = recordings.filter((r) => {
    const matchesSearch =
      !localSearch || r.name.toLowerCase().includes(localSearch.toLowerCase());
    const matchesFilter =
      filterMode === "all" ||
      (filterMode === "favorites" && r.isFavorite) ||
      (filterMode === "recent"); // recent = default sort
    return matchesSearch && matchesFilter;
  });

  const sorted =
    filterMode === "recent"
      ? [...filtered].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      : filtered;

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#F8FAFC] tracking-tight">Practice Library</h1>
        <p className="text-xs text-[#64748B]">Your recordings and sessions</p>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]">
          🔍
        </span>
        <input
          type="search"
          value={localSearch}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search recordings…"
          className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-9 py-2.5 text-sm text-[#F8FAFC]
                     placeholder:text-[#475569] focus:outline-none focus:border-[#F59E0B] transition-colors"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "recent", "favorites"] as const).map((mode) => (
          <Button
            key={mode}
            variant={filterMode === mode ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterMode(mode)}
            className="capitalize"
          >
            {mode}
          </Button>
        ))}
      </div>

      {/* Recordings list */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <span className="text-4xl opacity-30">🎵</span>
          <p className="text-sm text-[#64748B]">
            {localSearch ? "No recordings match your search." : "No recordings yet. Start recording in the Harmonium tab!"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-[#475569]">{sorted.length} recording{sorted.length !== 1 ? "s" : ""}</p>
          {sorted.map((rec) => (
            <RecordingCard key={rec.id} recording={rec} />
          ))}
        </div>
      )}

      {/* Future sections */}
      <div className="rounded-xl border border-dashed border-[#334155] p-4 opacity-40 flex flex-col gap-1">
        <p className="text-sm font-semibold text-[#64748B]">Coming Soon</p>
        <p className="text-xs text-[#475569]">Lesson library · Practice plans · AI recommendations</p>
      </div>
    </div>
  );
}
