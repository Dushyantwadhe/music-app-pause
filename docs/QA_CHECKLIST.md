# Riyaaz manual QA checklist

Run this checklist before a release and record the browser, OS, device type, tester, date, and app version with each result. Mark every item **Pass**, **Fail**, or **Not applicable**; attach a short reproduction path for failures.

## Test environment

| Field | Value |
| --- | --- |
| App version / commit | |
| Tester | |
| Date | |
| Browser + version | |
| Operating system + version | |
| Device type | Desktop / phone / tablet |
| Audio output | Built-in / wired / Bluetooth |
| Network state | Online / offline |

## Smoke test

- [ ] App loads at `/` with no console errors that block use.
- [ ] Navigation reaches Sessions, Harmonium, Tabla, and Profile.
- [ ] Refreshing each route does not cause a fatal error.
- [ ] View is usable at a phone-sized width and a desktop width.

## Harmonium

- [ ] A click/tap on a white key produces the expected note.
- [ ] A click/tap on a black key produces the expected note.
- [ ] Press/release computer keyboard mappings play and stop notes without stuck notes.
- [ ] Multiple quick notes do not leave stale active-note labels.
- [ ] Volume, sustain, octave, transpose, root Sa, tuning, tone, and bellows controls change state without error.
- [ ] Drone can start and stop; changing drone/root/octave while active does not create duplicate or continuing sound.
- [ ] Navigating away from the page stops active audio cleanly.

## Tabla and metronome

- [ ] Each available taal can be selected and displays a beat pattern.
- [ ] Play, pause, and stop work; stop resets the beat indicator.
- [ ] BPM changes apply correctly before and during playback.
- [ ] Count-in values (off, 2, 4, 8) behave as labelled.
- [ ] Loop mode, tabla/metronome mode, pitch, variants, style packs, and preset slots can be changed without breaking playback.
- [ ] Beat visualisation advances in step with audible rhythm at slow, medium, and fast BPM.
- [ ] Navigating away stops rhythm playback.

## Sessions

- [ ] Create a session from `/`; it opens at its unique `/session/[id]` route.
- [ ] Rename and describe a session; refresh and confirm persistence.
- [ ] Add harmonium and tabla cards; each can be focused, configured, reordered, and removed.
- [ ] Removing/disabling the final harmonium card stops its drone.
- [ ] Removing/disabling the final tabla card stops its rhythm.
- [ ] Play, pause, complete, duplicate, and delete session actions result in the expected state/list entry.
- [ ] Return to Sessions; confirm item count, duration, and updated time are sensible.

## Recording and library

- [ ] Start recording after a user gesture; a visible recording state appears.
- [ ] Stop recording; playback works in the same browser.
- [ ] Save a named recording; it appears in the library/profile count as expected.
- [ ] Favourite/unfavourite and delete work without affecting other recordings.
- [ ] If recording is unsupported or denied, the user sees a clear actionable message rather than a silent failure.

## Persistence and profile

- [ ] Harmonium, tabla, library, and profile settings persist after refresh where intended.
- [ ] Default BPM, volume, octave, drone, and latency preference can be changed and retained.
- [ ] Practice/session/recording/favourite totals display without runtime errors.
- [ ] Sign-in control accurately reflects whether Firebase is configured and does not promise sync that is unavailable.

## Accessibility and resilience

- [ ] Keyboard-only navigation reaches all primary controls with a visible focus state.
- [ ] Buttons, inputs, and icon actions have meaningful labels.
- [ ] Text and interactive controls remain legible at browser zoom of 200%.
- [ ] Touch targets are operable on a phone without accidental adjacent actions.
- [ ] Switching tabs, backgrounding the device, and returning does not leave hidden/stuck audio running.
- [ ] Offline launch and use of local features has an understood result; unexpected failures are visible.

## Release decision

- [ ] No unresolved P0 defect: data loss, stuck audio, broken playback, inaccessible core action, or fatal route failure.
- [ ] New known limitations are added to release notes/README.
- [ ] Browser/device test coverage is recorded.
- [ ] Product owner has accepted any non-blocking defects.
