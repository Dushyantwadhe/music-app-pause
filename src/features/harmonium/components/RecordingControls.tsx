"use client";

import { useState, useRef } from "react";
import { useHarmoniumStore } from "@/store/useHarmoniumStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useProfileStore } from "@/store/useProfileStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { startAudioCapture, stopAudioCapture } from "../engine/audioEngine";

export function RecordingControls() {
  const { isRecording, startRecording, stopRecording, recordedNotes } = useHarmoniumStore();
  const addRecording = useLibraryStore((s) => s.addRecording);
  const updateStats  = useProfileStore((s) => s.updateStats);
  const recordingCount = useLibraryStore((s) => s.recordings.length);

  const [recordingName, setRecordingName] = useState("");
  const [savedBlobUrl, setSavedBlobUrl]   = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const startTimeRef  = useRef<number>(0);
  const durationRef   = useRef<number>(0);

  async function handleStart() {
    if (isStarting) return;
    if (savedBlobUrl) URL.revokeObjectURL(savedBlobUrl);
    setError(null);
    setRecordingName("");
    setSavedBlobUrl(null);
    setIsStarting(true);
    try {
      await startAudioCapture((message) => {
        stopRecording();
        setError(message);
      });
      startTimeRef.current = Date.now();
      startRecording();
    } catch (captureError) {
      const message = captureError instanceof Error ? captureError.message : "Recording could not start.";
      setError(message);
      stopRecording();
    } finally {
      setIsStarting(false);
    }
  }

  async function handleStop() {
    setError(null);
    durationRef.current = Math.round((Date.now() - startTimeRef.current) / 1000);
    stopRecording();
    try {
      const blob = await stopAudioCapture();
      if (!blob || blob.size === 0) {
        setError("No audio was captured. Please try recording again.");
        return;
      }
      setSavedBlobUrl(URL.createObjectURL(blob));
    } catch {
      setError("Recording could not be saved. Please try again.");
    }
  }

  function handleSave() {
    if (!savedBlobUrl) return;
    const name = recordingName.trim() || `Recording ${new Date().toLocaleString()}`;
    addRecording({
      id: crypto.randomUUID(),
      uid: "",
      name,
      durationSeconds: durationRef.current,
      createdAt: new Date(),
      storageUrl: null,
      isFavorite: false,
      notes: "",
      tags: [],
      instrument: "harmonium",
      blobUrl: savedBlobUrl,
    });
    updateStats({ recordingsCount: recordingCount + 1 });
    setSavedBlobUrl(null);
    setRecordingName("");
  }

  function handleDiscard() {
    if (savedBlobUrl) URL.revokeObjectURL(savedBlobUrl);
    setSavedBlobUrl(null);
    setRecordingName("");
  }

  return (
    <Card>
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#6b7280]">
        Recording
      </p>
      <div className="flex flex-wrap gap-2 items-center">
        {!isRecording && !savedBlobUrl && (
          <Button variant="surface" size="sm" onClick={handleStart} disabled={isStarting}>
            <span className="h-2.5 w-2.5 rounded-full bg-[#dc2626]" />
            {isStarting ? "Starting…" : "Record"}
          </Button>
        )}

        {isRecording && (
          <>
            <span className="flex items-center gap-1.5 text-xs font-medium text-[#dc2626]">
              <span className="rec-dot h-2.5 w-2.5 rounded-full bg-[#dc2626]" />
              Recording...
            </span>
            <Button variant="danger" size="sm" onClick={handleStop}>Stop</Button>
          </>
        )}

        {savedBlobUrl && (
          <div className="w-full flex flex-col gap-2">
            <audio controls src={savedBlobUrl} className="w-full h-8 rounded-lg" />
            <div className="flex gap-2 flex-wrap items-center">
              <input
                type="text"
                value={recordingName}
                onChange={(e) => setRecordingName(e.target.value)}
                placeholder="Name this recording..."
                className="min-w-0 flex-1 rounded border border-[#d1d5db] px-3 py-1.5 text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none"
              />
              <Button size="sm" onClick={handleSave}>Save</Button>
              <Button variant="ghost" size="sm" onClick={handleDiscard}>Discard</Button>
            </div>
          </div>
        )}

        {isRecording && recordedNotes.length > 0 && (
          <span className="text-xs text-[#6b7280]">{recordedNotes.length} notes</span>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-[#b91c1c]">{error}</p>
      )}
    </Card>
  );
}
