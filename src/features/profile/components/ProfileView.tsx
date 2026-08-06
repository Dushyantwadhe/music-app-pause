"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useTablaStore } from "@/store/useTablaStore";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import type { UserSettings } from "@/types";

export function ProfileView() {
  const { user, settings, updateSettings, signOut } = useProfileStore();
  const recordings = useLibraryStore((s) => s.recordings);
  const sessions = useLibraryStore((s) => s.sessions);
  const favoriteTaals = useTablaStore((s) => s.favoriteTaals);

  const totalMinutes = Math.floor(sessions.reduce((acc, session) => acc + (session.actualPracticeSeconds ?? 0), 0) / 60);

  const stats = [
    { label: "Practice Minutes", value: totalMinutes },
    { label: "Total Sessions",   value: sessions.length },
    { label: "Recordings",       value: recordings.length },
    { label: "Favorite Taals",   value: favoriteTaals.length },
  ];

  function patchSetting<K extends keyof UserSettings>(key: K, val: UserSettings[K]) {
    updateSettings({ [key]: val } as Partial<UserSettings>);
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-base font-bold text-[#111827]">Profile</h1>
        <p className="text-[11px] text-[#6b7280]">Your practice stats and settings</p>
      </div>

      <Card className="p-3">
        {user ? (
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#e5e7eb]">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl text-[#6b7280]">
                  {user.displayName?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-[#111827]">{user.displayName}</p>
              <p className="truncate text-[11px] text-[#6b7280]">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-2">
            <p className="text-center text-xs text-[#6b7280]">
              Sign in to sync your practice data across devices
            </p>
            <Button
              size="md"
              onClick={() => {
                alert("Firebase Auth: Configure NEXT_PUBLIC_FIREBASE_* env vars to enable Google Sign-In");
              }}
              className="gap-2"
            >
              <GoogleIcon /> Sign in with Google
            </Button>
          </div>
        )}
      </Card>

      <div>
        <SectionHeader title="Practice Stats" />
        <div className="grid grid-cols-2 gap-2">
          {stats.map(({ label, value }) => (
            <Card key={label} className="flex flex-col gap-0.5 p-2.5">
              <p className="text-lg font-bold text-[#111827]">{value}</p>
              <p className="text-[11px] text-[#6b7280]">{label}</p>
            </Card>
          ))}
        </div>
      </div>

      {favoriteTaals.length > 0 && (
        <Card className="p-3">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
            Favorite Taals
          </p>
          <div className="flex flex-wrap gap-1.5">
            {favoriteTaals.map((t) => (
              <span
                key={t}
                className="rounded border border-[#d1d5db] bg-[#f9fafb] px-2 py-0.5 text-[11px] font-medium text-[#374151]"
              >
                {t}
              </span>
            ))}
          </div>
        </Card>
      )}

      <div>
        <SectionHeader title="Settings" />
        <Card className="flex flex-col gap-3 p-3">
          <Slider
            label="Default BPM"
            value={settings.defaultBPM}
            min={40}
            max={240}
            onChange={(v) => patchSetting("defaultBPM", v)}
            formatValue={(v) => `${v} BPM`}
          />
          <Slider
            label="Default Volume"
            value={Math.round(settings.defaultVolume * 100)}
            min={0}
            max={100}
            onChange={(v) => patchSetting("defaultVolume", v / 100)}
            formatValue={(v) => `${v}%`}
          />
          <Slider
            label="Default Octave"
            value={settings.defaultOctave}
            min={2}
            max={6}
            onChange={(v) => patchSetting("defaultOctave", v)}
            formatValue={(v) => `Oct ${v}`}
          />
          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
              Audio Quality
            </p>
            <div className="flex gap-2 flex-wrap">
              {(["interactive", "balanced", "playback"] as const).map((hint) => (
                <Button
                  key={hint}
                  variant={settings.audioLatencyHint === hint ? "primary" : "outline"}
                  size="sm"
                  onClick={() => patchSetting("audioLatencyHint", hint)}
                  className="capitalize"
                >
                  {hint}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="rounded border border-dashed border-[#d1d5db] p-2.5">
        <p className="text-[11px] text-[#6b7280]">
          AI practice recommendations · Cloud sync · Advanced stats — Coming soon
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
