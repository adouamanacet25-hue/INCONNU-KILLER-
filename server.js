
/**
 * 亗 I₦₵Ø₦₦Ʉ 亗 ₭łⱠⱠɆⱤ 亗
 * WhatsApp + Telegram Dual Bot
 * Author: Mr KIRA & Mr EGO TECH
 *
 * Déploiement:
 *   npm install
 *   node server.js
 *
 * Render Free: sleep 15min → /tmp effacé → reconnexion /pair
 * Pairing code: 60 secondes (limite WhatsApp)
 */

const TelegramBot = require('node-telegram-bot-api');
const makeWASocket = require('@whiskeysockets/baileys').default;
const {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestWaWebVersion
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const path = require('path');

// ══════════════════════════════════════════════════════
// CONFIG
// ══════════════════════════════════════════════════════
const TELEGRAM_TOKEN = '8806148683:AAHVWbe2gDK_rbFN6kiMMCHI1zQcrqWAtxY';
const BOT_NAME = '亗 I₦₵Ø₦₦Ʉ 亗 ₭łⱠⱠɆⱤ 亗';
const BOT_IMAGE = 'https://i.ibb.co/JWn9SSJr/4-C2-E3-E48-CEB1-468-B-B819-900-ED4842-E57.jpg';
const TG_IMAGE = 'https://i.ibb.co/hJqtxPrb/52-C1-EBD9-25-DC-44-E8-894-E-BE9755-E9-CB2-A.jpg';
const PREFIX = '.';

const LINKS = {
    waChannel: 'https://whatsapp.com/channel/0029Vb7WJzp84OmBD0fEEJ2X',
    tgChannel: 'https://t.me/+mQ3aQpCsEqI0YmY0',
    tgGroup: 'https://t.me/+Z-P_xjUgJjU0MjM0',
    waGroup: 'https://chat.whatsapp.com/Jeiy7Bty56p8oMs5hJrDWJ?s=cl&p=i&mlu=0&ilr=4',
    supportBan: 'https://adouamanacet25-hue.github.io/Dark-purge/'
};

// ══════════════════════════════════════════════════════
// ÉTAT GLOBAL
// ══════════════════════════════════════════════════════
const waSessions = new Map();
const waState = { connected: false, sock: null, connectedAt: null };

// ══════════════════════════════════════════════════════
// TELEGRAM
// ══════════════════════════════════════════════════════
const tgBot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
console.log(`[TG] ${BOT_NAME} démarré`);

// ---------- /start ----------
tgBot.onText(/^\/start$/, async (msg) => {
    const id = msg.chat.id;
    try {
        await tgBot.sendPhoto(id, TG_IMAGE, {
            caption: `═══════════════════════════════════════════
   ✦  WELCOME IN BOT TELEGRAM ✦
═══════════════════════════════════════════

✅ NAME       : ${BOT_NAME}

👑 CREATOR   : MR KiRA & EGO 🌹

───────────────────────────────────────────
  DESCRIPTION
───────────────────────────────────────────
It's a Telegram bot that connects to
a WhatsApp account for use many commands

───────────────────────────────────────────
  JOIN MY CHANNEL
───────────────────────────────────────────

🔗 ${LINKS.tgChannel}

───────────────────────────────────────────
  EXAMPLE COMMAND
───────────────────────────────────────────
⚡ Type : /pair 242...  (to use the  bot) ✅

═══════════════════════════════════════════`,
            parse_mode: 'HTML'
        });
    } catch (e) { console.log('[TG]', e.message); }

    try {
        await tgBot.sendMessage(id,
            `🔔 <b>Rejoins mes canaux avant d'utiliser le bot</b>\n\n` +
            `📢 Chaîne Telegram : ${LINKS.tgChannel}\n` +
            `👥 Groupe Telegram : ${LINKS.tgGroup}\n` +
            `💬 Groupe WhatsApp : ${LINKS.waGroup}\n` +
            `📱 Chaîne WhatsApp : ${LINKS.waChannel}\n\n` +
            `Tape /pair suivi du numéro WhatsApp (sans +) pour connecter le bot.`,
            { parse_mode: 'HTML' }
        );
    } catch (e) { console.log('[TG]', e.message); }
});

// ---------- /help ----------
tgBot.onText(/^\/help$/, async (msg) => {
    await tgBot.sendMessage(msg.chat.id,
        `📖 <b>AIDE</b>\n\n` +
        `Tape <code>/pair</code> suivis du numéro sans le ( + )\n\n` +
        `Ex: <code>/pair 242061234567</code>\n\n` +
        `* Tu récupères le code pair et tu le connectes à ton compte WhatsApp ✅`,
        { parse_mode: 'HTML' }
    );
});

// ---------- /menu (telegram) ----------
tgBot.onText(/^\/menu$/, async (msg) => {
    const id = msg.chat.id;
    try {
        await tgBot.sendPhoto(id, BOT_IMAGE, {
            caption: `▉ ${BOT_NAME} 🌹▉
▰▰▰▰▰▰▰▰▰▰
➠ Auteur : Mr kira tech 🌹
➠ Prefix WhatsApp : *[ . ]*
➠ Total Cmds : *100*

╢ GROUP ♰
.add .antibadword .antibot .antilink .antispam .antitag
.goodbye .del .ppgroup .groupinfo .groupname .kick .purge
.left .link .listadmin .mute .promote .resetlink .revoke
.setgdesc .staff .tag .tagall .unmute .welcome

╢ FUN ♰
.blague .character .compliment .dare .fact .flirt .gif
.goodnight .meme .news .quote .roseday .ship .stupid
.trivia .truth .valentine

╢ OWNER ♰
.allkaya .autoreact .autostatus .ban .block .blockinbox
.getpp .private .recording .report .sudo .typing .unban .update

╢ MEDIA ♰
.instagram .video .apk .capcut .facebook .getstatus .img
.mediafire .movie .pinterest .wallpapers

╢ GENERAL ♰
.alive .antidelete .channelid .fancy .gpstatus .menu
.owner .pair .ping .repo .voice

╢ AI ♰
.tts .ai .chatbot .imagine .manga .pixelart .gsticker .traduc

╢ TOOLS ♰
.attp .photo .sticker .tg .take .textmaker .supportban .vv

╢ SYSTEM ♰
.allprefix .botimage .botname .delprefix .online .prefix .speed

> power by Kira &
