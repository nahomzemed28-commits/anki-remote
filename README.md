# Anki Remote

Use your phone as a remote control for Anki review sessions on your computer.

How it works: a small local server runs on your computer (where Anki lives)
and talks to the [AnkiConnect](https://ankiweb.net/shared/info/2055492159)
addon over `127.0.0.1`. Your phone never talks to AnkiConnect directly — it
only talks to this server over your home WiFi, which forwards commands to
Anki.

## Requirements

- Anki **24.6.3 or newer** (AnkiConnect requires it — check your version under
  `Anki > About`).
- Node.js 18+ on the computer Anki runs on.
- Your phone and computer on the same WiFi network.

## Setup

1. **Install AnkiConnect** in Anki: `Tools > Add-ons > Get Add-ons...` and
   enter the code `2055492159`. Restart Anki. No config changes needed —
   AnkiConnect's defaults (listening on `127.0.0.1:8765`) work fine since
   this server runs on the same machine.

2. **Start the remote server.**

   No install needed — just run:

   ```
   npx anki-remote
   ```

   (Requires Node.js 18+. If you've cloned this repo instead, run
   `npm start` from the project folder.)

3. The terminal prints a URL like `http://192.168.1.23:8080`. Open that URL
   in your phone's browser (phone must be on the **same WiFi network** as
   your computer). Optionally "Add to Home Screen" for an app-like icon.

4. On your computer, open Anki and start reviewing a deck. The phone page
   syncs automatically (polls every second) and shows the current card.

## Using it

- **Show Answer** reveals the back of the card.
- **Again / Hard / Good / Easy** grade the card (same as the desktop
  shortcuts 1–4) and advance to the next card.
- **Undo** undoes the last answer.

## Limitations

- Card styling (custom CSS) and embedded media (images/audio) from your note
  types are not fetched — only the raw question/answer HTML is shown.
  Plain text/basic-HTML cards look fine; heavily styled cards may look
  plain.
- The remote assumes it's the only thing driving the review screen. If you
  also click around in Anki's desktop window mid-review, the phone's
  "show answer" state can get out of sync until the next card.
- Everything stays on your local network — nothing is sent anywhere else.

## Changing the port

```
PORT=9000 npx anki-remote
```
