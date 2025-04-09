import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    Browsers,
} from "@whiskeysockets/baileys";
import type { Boom } from "@hapi/boom";
import pino from "pino";
import pretty from "pino-pretty";

async function startWhatsAppBot() {
    const AUTH_FOLDER = "./auth_state";
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: Browsers.ubuntu("Chrome"),
        logger: pino(
            pretty({
                colorize: true,
            })
        ),
    });

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "close") {
            const shouldReconnect =
                (lastDisconnect?.error as Boom)?.output?.statusCode !==
                DisconnectReason.loggedOut;
            console.log(
                "Connection closed due to ",
                lastDisconnect?.error,
                ", reconnecting: ",
                shouldReconnect
            );

            if (shouldReconnect) {
                startWhatsAppBot();
            }
        } else if (connection === "open") {
            console.log("Connection opened!");
        }
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        for (const message of messages) {
            if (!message.key.fromMe && message.message) {
                const messageText =
                    message.message?.conversation ||
                    message.message?.extendedTextMessage?.text ||
                    message.message?.imageMessage?.caption ||
                    "";

                console.log("Received message:", messageText);
                const senderJid = message.key.remoteJid;

                if (senderJid) {
                    if (messageText.toLowerCase() === "ping") {
                        await sock.sendMessage(senderJid, {
                            text: "pong",
                        });
                    } else if (messageText.toLowerCase() === "hello") {
                        await sock.sendMessage(senderJid, {
                            text: "Hello there! I am a WhatsApp bot.",
                        });
                    } else if (messageText.toLowerCase().startsWith("!echo ")) {
                        const echoText = messageText.slice(6);
                        await sock.sendMessage(senderJid, { text: echoText });
                    }
                }
            }
        }
    });
}

startWhatsAppBot().catch((err) => console.error("Error in WhatsApp bot:", err));
