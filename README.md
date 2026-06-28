# Anki Remote

This lets you use your phone like a TV remote for Anki. You look at the
flashcards on your computer screen, and tap buttons on your phone to flip
the card and grade it — instead of reaching for your mouse or keyboard.

No computer or coding experience needed. Just follow the steps below in
order, exactly as written.

## What you need first

- A Mac computer with **Anki** already installed and open.
- A free add-on for Anki called **AnkiConnect** (Step 1 below shows you how).
- A free program called **Node.js** (Step 2 below shows you how).
- Your phone and your computer connected to the **same WiFi network**.

## Step 1: Install AnkiConnect

This is a free add-on that lets other programs (like this remote) talk to Anki.

1. Open **Anki** on your computer.
2. Click on **Tools** in the menu bar at the top of the screen.
3. Click **Add-ons**.
4. Click the button that says **Get Add-ons...**
5. A small box will pop up asking for a code. Type in exactly this:
   ```
   2055492159
   ```
6. Click **OK**.
7. Close Anki completely and open it again (this is called "restarting" it).

## Step 2: Install Node.js

This is a free program your computer needs in order to run the remote.

1. Go to **[nodejs.org](https://nodejs.org)** in your web browser.
2. Click the big button that says **Download** (pick the version that says **LTS**).
3. Open the file you just downloaded and click **Continue** through the installer, using all the default options.

## Step 3: Open the Terminal app

The Terminal is an app already on your Mac that lets you type instructions to your computer. Don't worry — you're only going to copy and paste a few lines.

1. Press the **Command (⌘)** key and the **Spacebar** at the same time.
2. A search box will appear. Type: `Terminal`
3. Press **Enter**. A window with white or black background and text will open — this is the Terminal.

## Step 4: Start the remote

In the Terminal window, type (or copy and paste) the following, pressing **Enter** after each line and waiting for it to finish before typing the next:

```
git clone https://github.com/nahomzemed28-commits/anki-remote.git
```

```
cd anki-remote
```

```
npm start
```

After the last line, the Terminal will print a short message, including a web address that looks something like:

```
http://192.168.1.23:8080
```

**Leave this Terminal window open** — closing it turns off the remote.

## Step 5: Open it on your phone

1. On your phone, open your web browser (Safari, Chrome, etc.).
2. Type in the address bar the web address from Step 4 (the one starting with `http://`).
3. Press Go. You should see a dark screen with a big button.

**Tip:** To avoid typing that address every time, bookmark the page, or tap the Share button and choose "Add to Home Screen" so it looks like an app icon.

## Step 6: Use it

1. On your computer, open Anki and start reviewing a deck like normal.
2. On your phone, tap **Show Answer** to flip the card.
3. Then tap one of the four colored buttons (**Again, Hard, Good, Easy**) to grade it and move to the next card.
4. If you make a mistake, tap **Undo** at the bottom of the screen.

That's it — you're done!

---

<details>
<summary>Advanced: changing the port number (most people can skip this)</summary>

```
PORT=9000 npm start
```
</details>

Licensed under [PolyForm Noncommercial 1.0.0](LICENSE) — free to use, modify, and share for non-commercial purposes.
