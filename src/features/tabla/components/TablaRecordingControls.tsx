"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MiniAudioPlayer } from "@/features/harmonium/components/RecordingControls";
import { useLibraryStore } from "@/store/useLibraryStore";
import { startTablaAudioCapture, stopTablaAudioCapture } from "../engine/rhythmEngine";

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export function TablaRecordingControls() {
  const recordings = useLibraryStore((state) => state.recordings);
  const addRecording = useLibraryStore((state) => state.addRecording);
  const deleteRecording = useLibraryStore((state) => state.deleteRecording);
  const [isRecording, setIsRecording] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [recordingName, setRecordingName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isListOpen, setIsListOpen] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);

  const tablaRecordings = recordings
    .filter((recording) => recording.instrument === "tabla")
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 6);

  async function handleStart() {
    if (isStarting) return;
    setError(null);
    setIsStarting(true);
    try {
      await startTablaAudioCapture((message) => {
        setIsRecording(false);
        setError(message);
      });
      setStartedAt(Date.now());
      setIsRecording(true);
    } catch (captureError) {
      setError(captureError instanceof Error ? captureError.message : "Recording could not start.");
    } finally {
      setIsStarting(false);
    }
  }

  async function handleStop() {
    setIsRecording(false);
    setDurationSeconds(Math.round((Date.now() - startedAt) / 1000));
    const blob = await stopTablaAudioCapture();
    if (!blob || blob.size === 0) {
      setError("No audio was captured. Please try recording again.");
      return;
    }
    setBlobUrl(URL.createObjectURL(blob));
  }

  function handleSave() {
    if (!blobUrl) return;
    addRecording({
      id: crypto.randomUUID(),
      uid: "",
      name: recordingName.trim() || `Tabla ${new Date().toLocaleString()}`,
      durationSeconds,
      createdAt: new Date(),
      storageUrl: null,
      isFavorite: false,
      notes: "",
      tags: [],
      instrument: "tabla",
      blobUrl,
    });
    setBlobUrl(null);
    setRecordingName("");
  }

  function handleDiscard() {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
    setRecordingName("");
  }

  return (
    <>
      <Card className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#111827]">Tabla recording</p>
            <p className="mt-0.5 text-[11px] text-[#6b7280]">Capture your current tabla playback.</p>
          </div>
          {isRecording ? (
            <Button variant="danger" size="sm" onClick={handleStop}>
              <span className="h-2 w-2 rounded-full bg-[#fecaca] animate-pulse" />
              Stop recording
            </Button>
          ) : (
            <Button variant="surface" size="sm" onClick={handleStart} disabled={isStarting || Boolean(blobUrl)}>
              <span className="h-2.5 w-2.5 rounded-full bg-[#dc2626]" />
              {isStarting ? "Starting..." : "Record"}
            </Button>
          )}
        </div>

        {error && <p role="alert" className="mt-2 text-xs text-[#b91c1c]">{error}</p>}
        {tablaRecordings.length > 0 && (
          <button
            type="button"
            onClick={() => setIsListOpen((isOpen) => !isOpen)}
            className="mt-3 flex w-full items-center justify-between border-t border-[#e8e1d4] pt-3 text-left"
            aria-expanded={isListOpen}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-[#6b7280]">Recordings ({tablaRecordings.length})</span>
            <span className="text-xs font-medium text-[#8a5a2b]">{isListOpen ? "Hide" : "Show"}</span>
          </button>
        )}

        {isListOpen && (
          <div className="mt-2 max-h-56 space-y-2 overflow-y-auto pr-1">
            {tablaRecordings.map((recording) => (
              <div key={recording.id} className="flex flex-wrap items-center gap-2 rounded border border-[#d1d5db] bg-[#fcfaf6] px-2.5 py-2">
                <div className="min-w-28 flex-1">
                  <p className="truncate text-sm font-medium text-[#111827]">{recording.name}</p>
                  <p className="mt-0.5 text-[11px] text-[#6b7280]">{formatDuration(recording.durationSeconds)}</p>
                </div>
                {recording.blobUrl ? <div className="min-w-44 flex-1"><MiniAudioPlayer src={recording.blobUrl} /></div> : null}
                <Button size="sm" variant="danger" onClick={() => deleteRecording(recording.id)}>Delete</Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {blobUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/30 p-4" role="presentation">
          <div className="w-full max-w-sm rounded border border-[#d9c8ae] bg-[#fffaf0] p-4 shadow-lg" role="dialog" aria-modal="true" aria-labelledby="save-tabla-recording-title">
            <p id="save-tabla-recording-title" className="text-sm font-semibold text-[#111827]">Save tabla recording</p>
            <p className="mt-0.5 text-xs text-[#6b7280]">Name this take before adding it to your recordings.</p>
            <MiniAudioPlayer src={blobUrl} />
            <input
              autoFocus
              type="text"
              value={recordingName}
              onChange={(event) => setRecordingName(event.target.value)}
              placeholder="Recording name"
              className="mt-3 w-full rounded border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-[#8a5a2b] focus:outline-none"
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={handleDiscard}>Discard</Button>
              <Button size="sm" onClick={handleSave}>Save recording</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
