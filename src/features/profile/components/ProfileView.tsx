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

  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

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
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#F8FAFC] tracking-tight">Profile</h1>
        <p className="text-xs text-[#64748B]">Your practice stats & settings</p>
      </div>

      {/* Auth card */}
      <Card>
        {user ? (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#273548] shrink-0">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl text-[#64748B]">
                  {user.displayName?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#F8FAFC] truncate">{user.displayName}</p>
              <p className="text-xs text-[#64748B] truncate">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-sm text-[#94A3B8] text-center">
              Sign in to sync your practice data across devices
            </p>
            <Button
              size="md"
              onClick={() => {
                // Firebase Auth handled here – see services/auth.ts
                alert("Firebase Auth: Configure NEXT_PUBLIC_FIREBASE_* env vars to enable Google Sign-In");
              }}
              className="gap-2"
            >
              <GoogleIcon /> Sign in with Google
            </Button>
          </div>
        )}
      </Card>

      {/* Stats */}
      <div>
        <SectionHeader title="Practice Stats" />
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value }) => (
            <Card key={label} className="flex flex-col gap-1">
              <p className="text-2xl font-bold text-[#F59E0B]">{value}</p>
              <p className="text-xs text-[#64748B]">{label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Favorite taals */}
      {favoriteTaals.length > 0 && (
        <Card>
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-2">
            Favorite Taals
          </p>
          <div className="flex flex-wrap gap-2">
            {favoriteTaals.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Settings */}
      <div>
        <SectionHeader title="Settings" />
        <Card className="flex flex-col gap-4">
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

          {/* Drone default */}
          <div>
            <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-2">
              Default Drone
            </p>
            <div className="flex gap-2 flex-wrap">
              {(["off","sa","pa","sa+pa"] as const).map((d) => (
                <Button
                  key={d}
                  variant={settings.defaultDrone === d ? "primary" : "outline"}
                  size="sm"
                  onClick={() => patchSetting("defaultDrone", d)}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>

          {/* Audio latency */}
          <div>
            <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-2">
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

      {/* Future */}
      <div className="rounded-xl border border-dashed border-[#334155] p-4 opacity-40">
        <p className="text-xs text-[#475569]">
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
