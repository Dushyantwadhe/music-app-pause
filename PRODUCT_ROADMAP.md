# Riyaaz product roadmap

## Purpose

Turn Riyaaz from a capable collection of practice tools into a dependable daily Indian-music practice companion. This roadmap is based on the current codebase: a browser-based harmonium, tabla/metronome, saved practice sessions, local persistence, recordings, profile settings, and Firebase scaffolding.

## Implementation status

- **Completed:** Product/technical README, release QA checklist, and the initial roadmap.
- **Completed:** Empty-state starter sessions for harmonium warm-up, Teentaal lay practice, and voice-and-rhythm practice.
- **Completed:** Explicit session playback actions and a clear, saved practice plan in the session workspace.
- **Completed:** Source-aware harmonium note handling for keyboard, pointer, and MIDI input; confirmed session deletion.
- **Completed:** Clear recording-start and recording-save failure messages, including unsupported-browser handling.
- **Completed:** Session instrument configurations now resync reliably, and Tabla variant selection is memoized to prevent avoidable re-render churn.
- **Completed:** MVP control simplification: session autosave, no per-tool renaming/removal, core instrument controls upfront, and specialist controls behind Advanced settings.
- **Completed:** Session configuration feedback loop removed; session deletion moved to the Sessions list with confirmation.
- **Completed:** Tanpura separated from Harmonium as a global practice tool; note release has pointer-end and rapid-repeat safeguards.
- **Completed:** Tabla cancels queued beat UI updates when stopped, and recording errors during capture now reset the interface with a clear message.
- **Completed:** Returning users have a one-click Continue Practice card for the paused, active, or most recently updated session.
- **Completed:** Sessions track actual active practice time across Start, Pause, and Finish; Profile totals now reflect recorded practice rather than planned duration.
- **Audit complete:** No remaining React update loop was found in the current session/instrument flow.
- **Completed:** Session audio controls now stop only the active session, and saved tabla autoplay/drone settings are preserved while configuring tools.
- **Completed:** Taal selection is non-autoplaying, Tabla cancels stale beat UI callbacks after stop, and in-progress MediaRecorder failures are surfaced clearly.
- **Completed:** Harmonium recordings have a compact, collapsible manager with a custom player, delete flow, and a focused save dialog.
- **Next:** Validate the starter sessions with target learners, then design the complete first-run onboarding and further simplify advanced instrument controls.

## Product principles

- Deliver a useful first practice within 30 seconds.
- Favour musical clarity over configuration density.
- Make every audio control predictable, low-latency, and recoverable.
- Build habits through small, visible progress rather than pressure or gamification for its own sake.
- Treat advanced settings as optional layers, not the default experience.

## Priority definitions

| Priority | Meaning |
| --- | --- |
| P0 | Required for a credible, usable core experience. |
| P1 | High-value improvement after the core is reliable. |
| P2 | Valuable expansion; do after user validation. |

## Phase 0 — Establish the baseline

### P0: Document the product and technical baseline

- **User problem:** The repository README is the default Next.js template, so product intent and operating assumptions are not captured.
- **Tasks:** Replace it with setup instructions, routes, feature map, browser/audio limitations, environment variables, and a short architecture overview. Add a changelog and release checklist.
- **Dependencies:** None.
- **Done when:** A new contributor can run the app, understand each route/store/engine, and identify which Firebase features are active versus only scaffolded.
- **Success signal:** Fewer setup questions and predictable handoffs.

### P0: Create a manual QA matrix

- **User problem:** Audio interactions can fail silently across browsers and devices.
- **Tasks:** Define test cases for page navigation, keyboard/touch harmonium input, drone start/stop, tabla play/pause/stop, tempo changes, count-in, recording, session save/reload, and sign-in state. Test Chrome, Safari, and a mobile browser.
- **Dependencies:** Access to target devices/browsers.
- **Done when:** Every release has a pass/fail record, known limitations, and owner for failures.
- **Success signal:** No critical audio/session regression reaches users.

### P0: Add basic automated checks

- **User problem:** Current quality gates are limited to linting and build capability.
- **Tasks:** Add unit tests for taal resolution, sargam/key mapping, store mutations, session serialization, and audio-engine-safe pure helpers. Add one browser-level smoke flow for creating and reopening a session.
- **Dependencies:** Test framework decision.
- **Done when:** Checks run locally and in CI before merge.
- **Success signal:** Core logic regressions are caught before manual testing.

## Phase 1 — Make the first practice effortless

### P0: Design a guided first-run flow

- **User problem:** A new user sees tools and settings before understanding how to begin a practice session.
- **Tasks:** Add a short welcome flow: choose goal (voice, harmonium, rhythm, or general riyaaz), experience level, preferred Sa/range, and daily time. Offer one recommended starter session and a single clear “Start practice” action.
- **Dependencies:** Product decisions on starter content and target learner segments.
- **Done when:** A first-time user can start an appropriate session without editing instrument settings.
- **Success signal:** Time-to-first-play under 30 seconds; high first-session completion.

### P0: Ship opinionated starter sessions

- **User problem:** An empty session builder creates choice overload.
- **Tasks:** Provide editable templates such as “10-minute vocal warm-up,” “15-minute harmonium basics,” “Teentaal lay practice,” and “20-minute raga preparation.” State duration, sequence, tempo, drone, and clear instructions for each step.
- **Dependencies:** Music educator review of exercises and terminology.
- **Done when:** Templates can be launched, duplicated, personalized, and restored safely.
- **Success signal:** Most new sessions originate from a template, not a blank canvas.

### P0: Simplify the primary practice surface

- **User problem:** Harmonium and tabla expose many controls before the user hears anything.
- **Tasks:** Separate “Play” controls from “Advanced settings.” Keep play, stop, tempo, selected taal, root Sa, and drone immediately visible; progressively disclose tone, tuning, pitch, style packs, and presets.
- **Dependencies:** Usability review of current screens.
- **Done when:** Core actions are understandable without musical-technology knowledge.
- **Success signal:** Fewer abandoned first sessions and fewer control changes before playback.

### P0: Define session playback behaviour

- **User problem:** Saved sessions contain instrument cards, but the exact user-facing run sequence and finish state must be explicit.
- **Tasks:** Specify how cards start, pause, advance, resume, and complete; show elapsed/remaining time; provide a safe stop-all action; preserve the session’s selected configurations.
- **Dependencies:** Decision on whether cards are manual steps, timed steps, or both.
- **Done when:** A user can complete a multi-tool session without navigating between pages or guessing what is active.
- **Success signal:** Session completion can be measured and repeated reliably.

## Phase 2 — Earn trust through musical and audio quality

### P0: Audit audio lifecycle and browser failure states

- **User problem:** Web Audio requires a user gesture and behaves differently when browsers suspend audio, switch tabs, or deny recording support.
- **Tasks:** Add clear errors and recovery actions for unsupported `AudioContext`/`MediaRecorder`, suspended contexts, recording failure, tab/background interruption, and audio output changes. Ensure all oscillators, timers, streams, and object URLs are cleaned up.
- **Dependencies:** Browser QA matrix.
- **Done when:** Each failure is visible, recoverable where possible, and does not leave audio playing or state stale.
- **Success signal:** No unexplained silence or orphaned playback in QA.

### P0: Validate latency and timing accuracy

- **User problem:** Rhythm practice depends on stable beat timing and responsive notes.
- **Tasks:** Measure note-on latency and tabla interval drift at common BPM values; test tempo changes during playback; verify count-in, loop, pause, and stop semantics. Establish supported-browser expectations.
- **Dependencies:** Device/browser test plan.
- **Done when:** Documented performance meets agreed tolerances on supported devices.
- **Success signal:** Musicians report the beat feels stable and playable.

### P1: Improve perceived instrument character

- **User problem:** Synthesized sounds may be functionally correct but not feel inspiring enough for sustained practice.
- **Tasks:** Evaluate current oscillator/envelope sound against user feedback; prototype refined harmonium voicing and tabla timbres; retain a lightweight low-latency option. Never sacrifice timing for cosmetic realism.
- **Dependencies:** Audio-design expertise and licensing decision if samples are considered.
- **Done when:** A blinded internal comparison identifies a preferred sound without latency regression.
- **Success signal:** Improved reported sound satisfaction and longer practice time.

### P1: Make tuning and musical context intelligible

- **User problem:** Controls such as tuning mode, transpose, thaat context, and pitch can confuse learners.
- **Tasks:** Use plain-language labels, contextual help, safe defaults, and examples. Clearly state that thaat context currently does not alter tabla rhythm. Surface sargam alongside western note names where useful.
- **Dependencies:** Music-pedagogy review.
- **Done when:** A beginner can choose defaults confidently and an advanced learner can reach precision controls quickly.
- **Success signal:** Lower settings churn and fewer support questions.

## Phase 3 — Build a durable practice habit

### P1: Add a lightweight practice home

- **User problem:** The home screen lists saved sessions but does not guide today’s practice.
- **Tasks:** Show “Continue last session,” a recommended session, weekly minutes, recent recordings, and a small next-step prompt. Keep this optional and calm.
- **Dependencies:** Reliable session-completion events.
- **Done when:** Returning users can resume a meaningful activity with one tap.
- **Success signal:** Increased weekly return rate and repeat sessions.

### P1: Capture meaningful practice history

- **User problem:** Existing profile statistics count planned session duration, not necessarily completed practice.
- **Tasks:** Record actual started/completed timestamps, elapsed active time, selected template, and optional self-rating. Distinguish plan length from completed practice time.
- **Dependencies:** Session playback behaviour and privacy policy.
- **Done when:** Profile totals are defensible and users can review their recent activity.
- **Success signal:** Accurate weekly/monthly practice summaries.

### P1: Add reflection, not automated musical claims

- **User problem:** Users need feedback and continuity, but the app cannot infer musical quality from current data.
- **Tasks:** After a session, offer optional prompts: “How steady was your lay?”, “What needs work?”, and “Save as next practice focus.” Do not claim pitch/rhythm analysis unless that feature is actually built and validated.
- **Dependencies:** Practice-history data model.
- **Done when:** Reflections are quick, skippable, private by default, and appear in the next session context.
- **Success signal:** Repeated use of saved practice notes.

### P2: Add reminders only after retention evidence

- **User problem:** Reminders can help consistency but can also become noise.
- **Tasks:** Let users choose time, days, and tone; provide easy opt-out; test value before adding streak pressure.
- **Dependencies:** Opt-in notifications strategy and measurable retention baseline.
- **Done when:** Reminders are permission-based and do not interrupt core practice.
- **Success signal:** Reminder recipients show improved practice continuity without elevated opt-out.

## Phase 4 — Data, account, and reliability

### P0: Decide the source of truth for user data

- **User problem:** Zustand persistence is local, while Firebase auth/Firestore code exists but cloud behavior is not fully connected in the current UI.
- **Tasks:** Decide whether the product is local-first, cloud-first, or hybrid. Define ownership of sessions, settings, recordings, migrations, conflict resolution, offline mode, and account deletion.
- **Dependencies:** Product/privacy decision and Firebase security design.
- **Done when:** One documented model defines what persists locally, what syncs, and what happens on a new device.
- **Success signal:** No ambiguous or lost user data during sign-in/out.

### P0: Finish authentication only when sync is ready

- **User problem:** Profile currently presents a Google sign-in control but configuration guidance indicates the flow is not finished for users.
- **Tasks:** Wire the real sign-in action, loading/error states, auth-state restoration, sign-out behavior, and Firestore security rules. Hide or label the control appropriately until usable.
- **Dependencies:** Firebase project configuration, OAuth setup, privacy policy, and data model decision.
- **Done when:** Sign-in securely syncs the promised data and sign-out has an understood local-data behavior.
- **Success signal:** Successful cross-device restore without duplicate or missing sessions.

### P1: Handle recordings deliberately

- **User problem:** Browser recording blobs, local storage limits, and cloud upload costs can create surprising failures.
- **Tasks:** Set limits, show storage usage, validate browser support, name and delete recordings clearly, revoke unused blob URLs, and decide whether recordings stay device-only or upload securely.
- **Dependencies:** Storage strategy and user consent.
- **Done when:** Users understand where recordings live and failures do not lose prior recordings.
- **Success signal:** Stable recording use without storage-related support issues.

### P1: Add privacy and data controls

- **User problem:** Practice history, profile identity, and recordings are personal data.
- **Tasks:** Write privacy terms, offer export/delete controls, explain storage location, minimize analytics, and request only required permissions.
- **Dependencies:** Data architecture and legal review appropriate to launch regions.
- **Done when:** Users can understand and control their data.
- **Success signal:** Launch is not blocked by unresolved data-handling questions.

## Phase 5 — UI and visual design polish (after core-flow validation)

### P1: Create a focused design system

- **User problem:** The app already has a warm, restrained visual direction, but some legacy/darker component styling appears inconsistent with the current cream/brown interface.
- **Tasks:** Consolidate colour tokens, typography scale, spacing, borders, interactive states, disabled/error/success states, and responsive breakpoints. Remove contradictory one-off colours as screens are touched.
- **Dependencies:** Validated primary flows from Phases 1–2.
- **Done when:** Shared Button, Card, Slider, navigation, and form patterns look and behave consistently.
- **Success signal:** New screens can be built from tokens/components without visual drift.

### P1: Improve accessibility and mobile ergonomics

- **User problem:** Practice often happens on phones, and instrument controls need reliable touch/keyboard interaction.
- **Tasks:** Audit contrast, focus order, semantic labels, keyboard operation, target sizes, screen-reader announcements for playback state, horizontal keyboard overflow, and reduced-motion behavior.
- **Dependencies:** QA matrix and final control hierarchy.
- **Done when:** Core flows are usable via keyboard and on small touch screens.
- **Success signal:** No high-severity accessibility findings in the core flow.

### P2: Add visual delight sparingly

- **User problem:** The app should feel calm and musical, not utilitarian or distracting.
- **Tasks:** Refine micro-feedback for beat, note, recording, completion, and empty states; avoid heavy animation during performance-sensitive tasks.
- **Dependencies:** Stable design system and audio performance validation.
- **Done when:** Feedback improves comprehension without visual noise or timing cost.
- **Success signal:** Positive qualitative feedback without performance regression.

## Explicit non-priorities for now

- AI practice recommendations: do not build before reliable practice-history data and clear user value.
- Automatic pitch/rhythm scoring: requires dedicated audio capture, analysis, calibration, validation, and careful claims.
- Social/community features: add only after solo practice retention is established.
- Large content catalogue: start with a few high-quality templates validated by learners/teachers.
- Full cloud sync: do not partially promise it; complete the data and security model first.

## Suggested delivery sequence

1. Baseline documentation, QA matrix, and test foundation.
2. Guided onboarding, starter sessions, simplified first-practice controls, and explicit session playback.
3. Audio reliability, timing validation, and browser failure handling.
4. Practice history and a lightweight returning-user home.
5. Data/auth/storage decisions and complete sync only if justified.
6. Consolidated UI design polish, accessibility, and restrained visual refinement.
7. Validated expansions: sound character, reminders, AI, analysis, community.

## Metrics to define before implementation

- Time from first visit to first audible playback.
- First session start and completion rate.
- Weekly active practitioners and sessions per practitioner.
- Median actual practice minutes per active practitioner.
- Seven-day and 28-day return rate.
- Audio/recording failure rate by browser and device class.
- Template adoption versus blank-session creation.
- User-reported sound quality and ease-of-use score.

## Working process

- Convert each selected roadmap item into a small implementation ticket with owner, estimate, dependencies, acceptance criteria, and metric.
- Validate P0 changes with five to eight representative learners before broadening scope.
- Release in small slices; measure behaviour; revise priorities rather than treating this document as fixed.
