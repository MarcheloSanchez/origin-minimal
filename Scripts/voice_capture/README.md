# voice_capture — voice-to-note for Origin v2.0

Two ways to get a spoken thought into `+Inbox` as a raw quick-capture note.
Both produce the **same raw format**, so the `capture-processor` agent
(`/process-capture` / `/process-inbox`) handles them identically — this tool
never classifies, tags, or moves anything.

- **Desktop:** local Whisper CLI (offline, no cloud, no API key).
- **iPhone:** a zero-code Apple Shortcut that writes the note into the
  iCloud/Obsidian-synced `+Inbox`. This is the real "capture while walking"
  path — no Python, no laptop.

---

## A. iPhone — Apple Shortcut (recommended for on-the-go)

No code. Dictation happens on-device; the file lands in your synced vault
and `capture-processor` picks it up on next `/process-inbox`.

### One-time setup

1. Open the **Shortcuts** app → **+** → name it `Origin Voice Capture`.
2. Add these actions in order:
   1. **Dictate Text** — Language: your choice (Czech or English; it
      auto-detects per dictation).
   2. **Set Variable** `spoken` = *Dictated Text*.
   3. **Current Date** → **Format Date**: custom `yyyy-MM-dd`. Set Variable
      `today`.
   4. **Current Date** → **Format Date**: custom `yyyy-MM-dd HH-mm-ss`. Set
      Variable `stamp`.
   5. **Text** — paste exactly (the blank lines matter):

      ```
      ---
      title: "Voice Note ⟨stamp⟩"
      type: atomic
      status: 📥inbox
      created: ⟨today⟩
      tags:
      processing_priority:
      related:
      captured_via: voice
      transcription_model: ios-dictation
      ---

      # Voice Note ⟨stamp⟩

      ## Content
      <!-- Quick capture - don't organize, just capture -->

      ⟨spoken⟩


      ## Context
      **Why captured**:
      **Source**: voice capture
      **Next action**:

      ## Processing Notes
      - [ ] Clarify and expand
      - [ ] Determine type (atomic/effort/source/moc)
      - [ ] Add proper tags
      - [ ] Move to appropriate folder
      - [ ] Create connections
      ```

      Replace each `⟨name⟩` by inserting the matching **Variable**
      (`stamp`, `today`, `spoken`) — do not type the brackets literally.
   6. **Save File**:
      - Service: **iCloud Drive** (or Obsidian's storage provider).
      - Destination folder: your vault's **`+Inbox`** folder.
      - File name: `Voice Note ⟨stamp⟩.md` (insert `stamp` variable;
        keep the `.md`).
      - **Overwrite If File Exists: Off** (Shortcuts auto-suffixes).
3. (Optional) Add the shortcut to the Home Screen / Lock Screen, or say
   *"Hey Siri, Origin Voice Capture"*.

### Daily use
Trigger the shortcut → speak → done. Next time you run `/process-inbox`,
the note is classified and filed like any other capture.

> Why a timestamp title (not the spoken words)? Keeps the shortcut trivial
> and filename-safe. `capture-processor` reads `## Content` and renames the
> note on filing anyway, so the placeholder title is throwaway.

---

## B. Desktop — local Whisper CLI

### Setup

```bash
python -m pip install -r 99-System/Scripts/voice_capture/requirements.txt
```

`openai-whisper` needs **ffmpeg** on PATH:
- Windows: `winget install Gyan.FFmpeg` (or `choco install ffmpeg`)

First run downloads the Whisper model (`small` ≈ 460 MB) once.

### Usage

Run from `99-System/Scripts/`:

```bash
cd "99-System/Scripts"

# Record until you press Enter, transcribe, write to +Inbox
python -m voice_capture

# Fixed-length recording (stops automatically after N seconds)
python -m voice_capture --duration 30

# Override language only if the auto cs/en pick is wrong
python -m voice_capture --language cs

# Preview without writing
python -m voice_capture --duration 15 --dry-run

# Type/paste instead of recording (no mic needed)
python -m voice_capture --text "an idea I want captured"
```

Then in Claude Code: `/process-capture` to classify and file the note.

### Models
`tiny` · `base` · `small` (default) · `medium` · `large` — bigger = more
accurate, slower, more RAM. `small` reliably handles Czech + English memos;
`base` misdetects short Czech clips as Polish.

### Recording length
By default recording runs until you press **Enter** (`Ctrl+C` aborts with
no note written). Pass `--duration N` to record a fixed N seconds instead
and stop automatically.

### Language
No `--language` needed. When not forced, Whisper's language detection runs
but is **constrained to Czech or English only** (ties → Czech), so it can
never drift to Polish or another language. Pass `--language cs` / `en` only
to override a wrong auto pick.

---

## Tests

```bash
cd "99-System/Scripts"
python -m pytest tests/test_voice_capture -v
```

All logic tests run without a mic or torch (heavy deps are lazy-imported).

## Manual desktop smoke test (requires mic + ffmpeg + `pip install -r requirements.txt`)

1. `cd "99-System/Scripts" && python -m voice_capture --duration 8 --dry-run`
   — speak a mixed Czech/English sentence; confirm the printed note has your
   words verbatim in `## Content`, `type: atomic`, `status: 📥inbox`, and no
   translation. Nothing is written (dry-run).
2. `python -m voice_capture --duration 8` — confirm
   `✅ Voice note created: …/+Inbox/<title>.md` and the file matches the raw
   capture structure.
3. In Claude Code: `/process-capture` — confirm `capture-processor` previews
   a type/destination and does **not** auto-route. Delete the test note
   afterward if throwaway.
