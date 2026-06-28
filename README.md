# Anki Remote

Use your phone as a remote control for Anki. No card text on the phone —
just big buttons (Show Answer, Again/Hard/Good/Easy, Undo). You look at
the card on your computer and tap on your phone.

## Setup

**You'll need:** Anki open on your computer, the [AnkiConnect](https://ankiweb.net/shared/info/2055492159) addon, and [Node.js](https://nodejs.org) installed.

1. **Install AnkiConnect** — in Anki: `Tools > Add-ons > Get Add-ons...` → paste in `2055492159` → restart Anki.

2. **Run the server** (on the same computer Anki is on):
   ```
   git clone https://github.com/nahomzemed28-commits/anki-remote.git
   cd anki-remote
   npm start
   ```

3. **Open the link it prints** (something like `http://192.168.1.23:8080`) in your phone's browser. Your phone needs to be on the **same WiFi** as your computer.

4. Start reviewing a deck in Anki — your phone syncs automatically.

That's it. Tip: bookmark the link or "Add to Home Screen" on your phone so you don't have to retype it next time.

Licensed under [PolyForm Noncommercial 1.0.0](LICENSE) — free to use, modify, and share for non-commercial purposes.

---

<details>
<summary>Using a different port</summary>

```
PORT=9000 npm start
```
</details>
