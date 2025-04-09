# WhatsApp Bot

A simple WhatsApp bot built with [Baileys](https://baileys.wiki/docs/intro) and Bun.

## Features

- Connects to WhatsApp Web using multi-device login
- Responds to simple commands:
  - `ping`: Bot responds with "pong"
  - `hello`: Bot responds with a greeting
  - `!echo [message]`: Bot echoes back your message

## Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or higher)
- A phone with WhatsApp installed

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   bun install
   ```

## Usage

1. Run the bot:
   ```
   bun run index.ts
   ```

2. Scan the QR code that appears in the terminal with your WhatsApp app:
   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices
   - Tap on "Link a Device"
   - Scan the QR code displayed in your terminal

3. Once connected, you can send messages to the bot from any chat:
   - Send "ping" to get "pong" back
   - Send "hello" to get a greeting
   - Send "!echo [your message]" to get your message echoed back

## Notes

- The bot saves session data in the `auth_state` directory. Don't delete this if you want to avoid having to re-scan the QR code.
- This is a simple example bot. You can extend it by adding more commands or functionality in the `messages.upsert` event handler.

## Disclaimer

This project is not affiliated with WhatsApp. Use it responsibly and don't spam people.
