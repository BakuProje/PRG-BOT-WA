
require("./settings");
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, delay, Browsers, makeCacheableSignalKeyStore, jidDecode, downloadContentFromMessage } = require('@whiskeysockets/baileys');

const { modul } = require("./module");
const moment = require("moment-timezone");
const figlet = require("figlet");
const gradient = require("gradient-string");
const { baileys, chalk, fs, FileType, path, pino, PhoneNumber, axios, } = modul;
const { makeInMemoryStore } = require("./lib/store/");
const { color, bgcolor } = require("./lib/color");
const { uncache, nocache } = require("./lib/loader");
const Pino = require("pino");
const readline = require("readline");
const yargs = require('yargs/yargs')
const _ = require('lodash')
const NodeCache = require("node-cache");

const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep, reSize, tanggal, day, bulan, tahun, weton, loadModule, protex } = require("./lib/myfunc");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, addExif } = require('./lib/exif')
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const prefix = "";
const type = (x) => x?.constructor?.name || (x === null ? "null" : "undefined");
const isStringSame = (x, y) => (Array.isArray(y) ? y.includes(x) : y === x);
const buttonTypes = [];

// Path utama database
const dbPath = path.join(__dirname, "database");
const dbFile = path.join(dbPath, "database.json");
const pentingFile = path.join(dbPath, "penting.json");
const usersJson = path.join(dbPath, "user.json");
const contactsFile = path.join(dbPath, "contacts.vcf");

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
  console.log(chalk.greenBright("[Database] Folder dibuat otomatis."));
}
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({}, null, 2));
  console.log(chalk.greenBright("[Database] File database.json dibuat."));
}
if (!fs.existsSync(usersJson)) {
  const userDefault = []
  fs.writeFileSync(usersJson, JSON.stringify(userDefault, null, 2));
  console.log(chalk.greenBright("[Database] File user.json dibuat."));
}
if (!fs.existsSync(pentingFile)) {
  const pentingDefault = {
    blacklistJpm: [],
    autoJpm: {
      status: false,
      interval: 0,
      type: "hour",
      messages: [],
      lastIndex: 0,
    },
  };
  fs.writeFileSync(pentingFile, JSON.stringify(pentingDefault, null, 2));
  console.log(chalk.greenBright("[Database] File penting.json dibuat."));
}

if (!fs.existsSync(contactsFile)) {
  fs.writeFileSync(contactsFile, "");
  console.log(chalk.greenBright("[Database] File contacts.vcf dibuat."));
}
const { handleIncomingMessage } = require("./lib/user");
const pentingPath = path.join(process.cwd(), "database", "penting.json")
let penting = JSON.parse(fs.readFileSync(pentingPath))
// Simpan perubahan ke file
function savePenting() {
  fs.writeFileSync(pentingPath, JSON.stringify(penting, null, 2))
}
var low
try {
low = require('lowdb')
} catch (e) {
low = require('./lib/lowdb')}
const { Low, JSONFile } = low
const mongoDB = require('./lib/mongoDB')

const store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store",
  }),
});

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
/https?:\/\//.test(opts['db'] || '') ?
new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
new mongoDB(opts['db']) :
new JSONFile(`./database/database.json`)
)
global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
if (global.db.data !== null) return
global.db.READ = true
await global.db.read()
global.db.READ = false
global.db.data = {
users: {},
chats: {},
game: {},
database: {},
settings: {},
setting: {},
others: {},
sticker: {},
...(global.db.data || {})}
  global.db.chain = _.chain(global.db.data)}
loadDatabase()

let phoneNumber = `${nomorbot}`;
const pairingCode = false;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(text, resolve)
    })
};
// ===================== CONSOLE SETUP ===================== //
console.clear();
console.log(
  chalk.yellow("[ Starting ] ") + chalk.white.bold("Welcome In Terminal PRG!")
);

process.on("unhandledRejection", (reason, promise) => {
  console.log(chalk.red("[Error] Unhandled Rejection →"), reason);
});
process.on("rejectionHandled", (promise) => {
  console.log(chalk.gray("[Info] Rejection handled."));
});
process.on("Something went wrong", function (err) {
  console.log(chalk.red("[Exception]"), err);
});

// ========== STARTUP SPLASH ========== //
setTimeout(() => {
  console.clear();
  console.log(
    chalk.cyan.bold(
      figlet.textSync("RACING GAME", { horizontalLayout: "full" })
    )
  );
  console.log(gradient.pastel.multiline("Booting PRG Engine..."));
  console.log(chalk.gray("──────────────────────────────────────────────"));
  console.log(chalk.white("Welcome to PRG V1.0"));
  console.log(chalk.gray("──────────────────────────────────────────────\n"));

  console.log(
    chalk.cyan.bold("Operating System Information:"),
    "\n",
    chalk.white(`├ Platform : ${modul.os.platform()} ${modul.os.arch()}`),
    "\n",
    chalk.white(`├ Release  : ${modul.os.release()}`),
    "\n",
    chalk.white(`├ Hostname : ${modul.os.hostname()}`),
    "\n",
    chalk.white(`├ Total RAM: ${(modul.os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`),
    "\n",
    chalk.white(`├ Free RAM : ${(modul.os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`),
    "\n",
    chalk.white(`└ Uptime   : ${modul.os.uptime()} sec\n`)
  );

  console.log(chalk.magenta.bold("==============================================="));
  console.log(chalk.cyan.bold("Preparing environment..."));
}, 1000);
protex();
const ask = (text) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(text, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
};

async function startsesi() {
  await new Promise((r) => setTimeout(r, 5000));
  console.clear();
  console.log(gradient.morning(figlet.textSync("PRG V1.0", { horizontalLayout: "full" })));
  console.log(chalk.gray("──────────────────────────────────────────────"));
  console.log(chalk.cyanBright("Initializing PRG System..."));
  console.log(chalk.gray("──────────────────────────────────────────────\n"));

  console.log(chalk.white.bold("Isi Data Owner & Bot"));
  console.log(chalk.gray("Data ini akan disimpan secara permanen di settings.js\n"));

  const settingsPath = "./settings.js";
  let settingsContent = fs.existsSync(settingsPath)
    ? fs.readFileSync(settingsPath, "utf-8")
    : "";

  if (!global.ownernumber || global.ownernumber.trim() === "") {
console.log(chalk.yellow("Daftarkan nomor owner (ex: 628xxxxxx): "));
global.ownernumber = await ask("> ");
}

if (!global.ownername || global.ownername.trim() === "") {
console.log(chalk.yellow("Siapa nama mu?: "));
global.ownername = await ask("> ");
}

if (!global.nomorbot || global.nomorbot.trim() === "") {
console.log(chalk.yellow("Masukkan nomor bot untuk pairing (ex: 628xxxxxx): "));
global.nomorbot = await ask("> ");
}

  try {
    settingsContent = settingsContent
      .replace(/global\.ownernumber\s*=\s*(['"`]).*?\1/, `global.ownernumber = '${global.ownernumber}'`)
      .replace(/global\.ownername\s*=\s*(['"`]).*?\1/, `global.ownername = '${global.ownername}'`)
      .replace(/global\.nomorbot\s*=\s*(['"`]).*?\1/, `global.nomorbot = '${global.nomorbot}'`);
    fs.writeFileSync(settingsPath, settingsContent, "utf-8");
    console.log(chalk.greenBright("\nData berhasil disimpan ke settings.js"));
  } catch (err) {
    console.log(chalk.red("Gagal menyimpan ke settings.js:"), err);
  }

  console.log(chalk.cyanBright("\nSystem Info:"));
  console.log(chalk.white(`├ Hostname : ${modul.os.hostname()}`));
  console.log(chalk.white(`├ Platform : ${modul.os.platform()} ${modul.os.arch()}`));
  console.log(chalk.white(`├ RAM Total: ${(modul.os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`));
  console.log(chalk.white(`├ Node.js  : ${process.version}`));
  console.log(chalk.white(`└ Owner    : ${global.ownername} (${global.ownernumber})`));

  console.log(chalk.gray("\n──────────────────────────────────────────────"));
  console.log(chalk.blueBright("Membuat koneksi dan pairing code...\n"));

  // ========== PAIRING ==========
const { state, saveCreds } = await useMultiFileAuthState("./session");
    const zassbtz = makeWASocket({
        printQRInTerminal: false,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        generateHighQualityLinkPreview: true, 
        version: (await (await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json')).json()).version,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        logger: pino({
            level: 'silent'
        }),
        auth: state
    });
    
    store.bind(zassbtz.ev);

  zassbtz.ev.on("creds.update", saveCreds);

  if (!zassbtz.authState.creds.registered) {
    await new Promise((r) => setTimeout(r, 3000));
    const code = await zassbtz.requestPairingCode(global.nomorbot, pair);
    console.log(chalk.black.bgGreen("Ini kode pairing kamu:"), chalk.white.bold(code));
  }

setInterval(async () => {
  try {
    if (!penting.autoJpm || !penting.autoJpm.status) return

    // Cek pesan tersedia
    if (!penting.autoJpm.messages || !penting.autoJpm.messages.length) return

    // Konversi interval ke ms
    let ms = penting.autoJpm.interval * 60000
    if (penting.autoJpm.type === "hour") ms *= 60
    if (penting.autoJpm.type === "day") ms *= 1440

    if (!penting.autoJpm._lastRun) penting.autoJpm._lastRun = Date.now()
    if (Date.now() - penting.autoJpm._lastRun < ms) return

    penting.autoJpm._lastRun = Date.now()

    // Pastikan lastIndex ada
    if (typeof penting.autoJpm.lastIndex !== "number") penting.autoJpm.lastIndex = 0

    // Ambil pesan giliran
    let idx = penting.autoJpm.lastIndex % penting.autoJpm.messages.length
    let pesan = penting.autoJpm.messages[idx]

    // Ambil semua grup kecuali blacklist
    const allGroups = await zassbtz.groupFetchAllParticipating()
    const groupIDs = Object.keys(allGroups).filter(id => !penting.blacklistJpm.includes(id))

    for (const gid of groupIDs) {
      try {
        if (pesan.type === "text") {
          await zassbtz.sendMessage(gid, { text: pesan.text })
        } else {
          // Skip kalau file ilang
          if (!fs.existsSync(pesan.path)) continue

          await zassbtz.sendMessage(gid, {
            [pesan.type]: fs.readFileSync(pesan.path),
            caption: pesan.caption || ""
          })
        }
        await sleep(global.delayJpm || 4000)
      } catch (e) {
        console.error(`❌ Gagal kirim ke ${gid}:`, e.message)
      }
    }

    penting.autoJpm.lastIndex = idx + 1
    savePenting()
  } catch (err) {
    console.error("❌ AutoJpm Error:", err.message)
  }
}, 60 * 1000)
    
    // FUNGSI CONNECTION - update tampilan
    zassbtz.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "connecting") {
            console.log(chalk.yellow("Connecting to WhatsApp..."));
        } else if (connection === "open") {
            loadModule(zassbtz);
            zassbtz.public = true;
            console.log(chalk.green.bold('✅ Connected Successfully to WhatsApp'));
            const ownerJid = zassbtz.user.id.split(":")[0] + "@s.whatsapp.net";
        } else if (connection === "close") {
            console.log(chalk.red("Connection closed, restarting..."));
            startsesi();
        }
    });
  
  zassbtz.ev.on('call', async (user) => {
if (!global.anticall) return
for (let ff of user) {
if (ff.isGroup == false) {
if (ff.status == "offer") {
let sendcall = await zassbtz.sendMessage(ff.from, {text: `@${ff.from.split("@")[0]} Maaf Kamu Akan Saya Block Karna Ownerbot Menyalakan Fitur *Anticall*\nJika Tidak Sengaja Segera Hubungi Owner Untuk Membuka Blokiran Ini`, contextInfo: {mentionedJid: [ff.from], externalAdReply: {thumbnail: fs.readFileSync("./media/warning.jpg"), title: "｢ CALL DETECTED ｣", previewType: "PHOTO"}}}, {quoted: null})
zassbtz.sendContact(ff.from, [global.ownernumber], "Developer WhatsApp Bot", sendcall)
await sleep(10000)
await zassbtz.updateBlockStatus(ff.from, "block")
}}
}})
  
  zassbtz.ev.on("messages.upsert", async (chatUpdate) => {
  try {
    const kay = chatUpdate.messages[0];
    if (!kay.message) return;

    // Ekstrak isi pesan (jika ephemeral)
    kay.message =
      Object.keys(kay.message)[0] === "ephemeralMessage"
        ? kay.message.ephemeralMessage.message
        : kay.message;

    const m = smsg(zassbtz, kay, store); // Setelah message didecode
    
if (!m.message) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
if (m.isBaileys) return
if (m.key && m.key.remoteJid === 'status@broadcast') {
if (global.autoreadsw) zassbtz.readMessages([m.key])
}
let fill = [global.ownernumber]
if (!zassbtz.public && !fill.includes(m.key.remoteJid.split("@")[0]) && !m.key.fromMe && chatUpdate.type === 'notify') return
if (global.autoread) zassbtz.readMessages([m.key])

const botNumber = zassbtz.user.id.split(":")[0]
// FUNGSI SELF / PUBLIC
if (
  !zassbtz.public &&
  !(
    kay.key.fromMe ||
    (kay.key.participant &&
      global.ownernumber.includes(kay.key.participant.split("@")[0])) ||
    global.ownernumber.includes(m.sender.split("@")[0]) ||
    botNumber.includes(m.sender.split("@")[0])
  ) &&
  chatUpdate.type === "notify"
) {
  return;
}

  zassbtz.public = true;

    // FUNGSI CEGAH PROSES CHAT DUPLIKAT
    if (kay.key.id.startsWith("BAE5") && kay.key.id.length === 16) return;

    // FUNGSI HANDLE MESSGAe
    if (
      !m.key.fromMe &&
      m.key.remoteJid.endsWith("@s.whatsapp.net") &&
      m.text
    ) {
      handleIncomingMessage(zassbtz, m.key.remoteJid);
    }

    // HANDLE UTAMA
    require("./case")(zassbtz, m, chatUpdate, store);
  } catch (err) {
    console.error("Error saat memproses pesan:", err);
  }
});
  zassbtz.ev.on("messages.update", async (chatUpdate) => {
    for (const { key, update } of chatUpdate) {
      if (update.pollUpdates && key.fromMe) {
        const pollCreation = await getMessage(key);
        if (pollCreation) {
          const pollUpdate = await getAggregateVotesInPollMessage({
            message: pollCreation,
            pollUpdates: update.pollUpdates,
          });
          var toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]?.name;
          if (toCmd == undefined) return;
          var prefCmd = prefix + toCmd;
          zassbtz.appenTextMessage(prefCmd, chatUpdate);
        }
      }
    }
  });
  zassbtz.sendTextWithMentions = async (jid, text, quoted, options = {}) =>
    zassbtz.sendMessage(
      jid,
      {
        text: text,
        contextInfo: {
          mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(
            (v) => v[1] + "@s.whatsapp.net",
          ),
        },
        ...options,
      },
      {
        quoted,
      },
    );
  zassbtz.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      );
    } else return jid;
  };
  zassbtz.ev.on("contacts.update", (update) => {
    for (let contact of update) {
      let id = zassbtz.decodeJid(contact.id);
      if (store && store.contacts)
        store.contacts[id] = {
          id,
          name: contact.notify,
        };
    }
  });
  zassbtz.getName = (jid, withoutContact = false) => {
    id = zassbtz.decodeJid(jid);
    withoutContact = zassbtz.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = zassbtz.groupMetadata(id) || {};
        resolve(
          v.name ||
            v.subject ||
            PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber(
              "international",
            ),
        );
      });
    else
      v =
        id === "0@s.whatsapp.net"
          ? {
              id,
              name: "WhatsApp",
            }
          : id === zassbtz.decodeJid(zassbtz.user.id)
            ? zassbtz.user
            : store.contacts[id] || {};
    return (
      (withoutContact ? "" : v.name) ||
      v.subject ||
      v.verifiedName ||
      PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
        "international",
      )
    );
  };
  zassbtz.parseMention = (text = "") => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net",
    );
  };
  zassbtz.sendContact = async (jid, kon, quoted = "", opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: await zassbtz.getName(i),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await zassbtz.getName(i)}\nFN:${await zassbtz.getName(i)}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${ytname}\nitem2.X-ABLabel:YouTube\nitem3.URL:${socialm}\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${location};;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
      });
    }
    zassbtz.sendMessage(
      jid,
      {
        contacts: {
          displayName: `${list.length} Contact`,
          contacts: list,
        },
        ...opts,
      },
      {
        quoted,
      },
    );
  };
  zassbtz.setStatus = (status) => {
    zassbtz.query({
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "set",
        xmlns: "status",
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8"),
        },
      ],
    });
    return status;
  };

  zassbtz.sendImage = async (jid, path, caption = "", quoted = "", options) => {
    let buffer = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    return await zassbtz.sendMessage(
      jid,
      {
        image: buffer,
        caption: caption,
        ...options,
      },
      {
        quoted,
      },
    );
  };
  zassbtz.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }
    await zassbtz.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      },
    ).then((response) => {
      fs.unlinkSync(buffer);
      return response;
    });
  };
  zassbtz.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }
    await zassbtz.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      },
    );
    return buffer;
  };
  zassbtz.sendImageAsStickerAvatar = async (
    jid,
    path,
    quoted,
    options = {},
  ) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImgAvatar(buff, options);
    } else {
      buffer = await imageToWebpAvatar(buff);
    }
    await zassbtz.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      },
    ).then((response) => {
      fs.unlinkSync(buffer);
      return response;
    });
  };
  zassbtz.sendVideoAsStickerAvatar = async (
    jid,
    path,
    quoted,
    options = {},
  ) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVidAvatar(buff, options);
    } else {
      buffer = await videoToWebpAvatar(buff);
    }
    await zassbtz.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      },
    );
    return buffer;
  };
  zassbtz.copyNForward = async (
    jid,
    message,
    forceForward = false,
    options = {},
  ) => {
    let vtype;
    if (options.readViewOnce) {
      message.message =
        message.message &&
        message.message.ephemeralMessage &&
        message.message.ephemeralMessage.message
          ? message.message.ephemeralMessage.message
          : message.message || undefined;
      vtype = Object.keys(message.message.viewOnceMessage.message)[0];
      delete (message.message && message.message.ignore
        ? message.message.ignore
        : message.message || undefined);
      delete message.message.viewOnceMessage.message[vtype].viewOnce;
      message.message = {
        ...message.message.viewOnceMessage.message,
      };
    }
    let mtype = Object.keys(message.message)[0];
    let content = await generateForwardMessageContent(message, forceForward);
    let ctype = Object.keys(content)[0];
    let context = {};
    if (mtype != "conversation") context = message.message[mtype].contextInfo;
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo,
    };
    const waMessage = await generateWAMessageFromContent(
      jid,
      content,
      options
        ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo
              ? {
                  contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo,
                  },
                }
              : {}),
          }
        : {},
    );
    await zassbtz.relayMessage(jid, waMessage.message, {
      messageId: waMessage.key.id,
    });
    return waMessage;
  };
  zassbtz.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true,
  ) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    let trueFileName;
    if (type.ext == "ogg" || type.ext == "opus") {
      trueFileName = attachExtension ? filename + ".mp3" : filename;
      await fs.writeFileSync(trueFileName, buffer);
    } else {
      trueFileName = attachExtension ? filename + "." + type.ext : filename;
      await fs.writeFileSync(trueFileName, buffer);
    }
    return trueFileName;
  };
  zassbtz.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };
  zassbtz.getFile = async (PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
        ? Buffer.from(PATH.split`,`[1], "base64")
        : /^https?:\/\//.test(PATH)
          ? await (res = await getBuffer(PATH))
          : fs.existsSync(PATH)
            ? ((filename = PATH), fs.readFileSync(PATH))
            : typeof PATH === "string"
              ? PATH
              : Buffer.alloc(0);
    let type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    if (data && save) fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data,
    };
  };
  zassbtz.sendText = (jid, text, quoted = "", options) =>
    zassbtz.sendMessage(
      jid,
      {
        text: text,
        ...options,
      },
      {
        quoted,
      },
    );
  zassbtz.serializeM = (m) => smsg(zassbtz, m, store);
  /**
   * Send Media/File with Automatic Type Specifier
   * @param {String} jid
   * @param {String|Buffer} path
   * @param {String} filename
   * @param {String} caption
   * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted
   * @param {Boolean} ptt
   * @param {Object} options
   */
  zassbtz.sendFile = async (
    jid,
    path,
    filename = "",
    caption = "",
    quoted,
    ptt = false,
    options = {},
  ) => {
    let type = await zassbtz.getFile(path, true);
    let { res, data: file, filename: pathFile } = type;
    if ((res && res.status !== 200) || file.length <= 65536) {
      try {
        throw {
          json: JSON.parse(file.toString()),
        };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    const fileSize = fs.statSync(pathFile).size / 1024 / 1024;
    if (fileSize >= 1800) throw new Error(" The file size is too large\n\n");
    let opt = {};
    if (quoted) opt.quoted = quoted;
    if (!type) options.asDocument = true;
    let mtype = "",
      mimetype = options.mimetype || type.mime,
      convert;
    if (
      /webp/.test(type.mime) ||
      (/image/.test(type.mime) && options.asSticker)
    )
      mtype = "sticker";
    else if (
      /image/.test(type.mime) ||
      (/webp/.test(type.mime) && options.asImage)
    )
      mtype = "image";
    else if (/video/.test(type.mime)) mtype = "video";
    else if (/audio/.test(type.mime))
      (convert = await toAudio(file, type.ext)),
        (file = convert.data),
        (pathFile = convert.filename),
        (mtype = "audio"),
        (mimetype = options.mimetype || "audio/mpeg; codecs=mp3");
    else mtype = "document";
    if (options.asDocument) mtype = "document";
    delete options.asSticker;
    delete options.asLocation;
    delete options.asVideo;
    delete options.asDocument;
    delete options.asImage;
    let message = {
      ...options,
      caption,
      ptt,
      [mtype]: {
        url: pathFile,
      },
      mimetype,
      fileName: filename || pathFile.split("/").pop(),
    };
    /**
     * @type {import('@whiskeysockets/baileys').proto.WebMessageInfo}
     */
    let m;
    try {
      m = await zassbtz.sendMessage(jid, message, {
        ...opt,
        ...options,
      });
    } catch (e) {
      console.error(e);
      m = null;
    } finally {
      if (!m)
        m = await zassbtz.sendMessage(
          jid,
          {
            ...message,
            [mtype]: file,
          },
          {
            ...opt,
            ...options,
          },
        );
      file = null; // releasing the memory
      return m;
    }
  };
  zassbtz.sendFile = async (jid, media, options = {}) => {
    let file = await zassbtz.getFile(media);
    let mime = file.ext,
      type;
    // Tentukan tipe file berdasarkan ekstensi
    if (mime == "mp3") {
      type = "audio";
      options.mimetype = "audio/mpeg";
      options.ptt = options.ptt || false;
    } else if (mime == "jpg" || mime == "jpeg" || mime == "png") {
      type = "image";
    } else if (mime == "webp") {
      type = "sticker";
    } else if (mime == "mp4") {
      type = "video";
    } else {
      type = "document";
    }
    // Menambahkan caption dan quoted ke pengiriman pesan
    return zassbtz.sendMessage(
      jid,
      {
        [type]: file.data,
        caption: options.caption || "", // Menambahkan caption jika ada
        ...options,
      },
      {
        quoted: options.quoted || "", // Menambahkan quoted jika ada
        ...options,
      },
    );
  };
  zassbtz.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
    let mime = "";
    let res = await axios.head(url);
    mime = res.headers["content-type"];
    if (mime.split("/")[1] === "gif") {
      return zassbtz.sendMessage(
        jid,
        {
          video: await getBuffer(url),
          caption: caption,
          gifPlayback: true,
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        },
      );
    }
    let type = mime.split("/")[0] + "Message";
    if (mime === "application/pdf") {
      return zassbtz.sendMessage(
        jid,
        {
          document: await getBuffer(url),
          mimetype: "application/pdf",
          caption: caption,
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        },
      );
    }
    if (mime.split("/")[0] === "image") {
      return zassbtz.sendMessage(
        jid,
        {
          image: await getBuffer(url),
          caption: caption,
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        },
      );
    }
    if (mime.split("/")[0] === "video") {
      return zassbtz.sendMessage(
        jid,
        {
          video: await getBuffer(url),
          caption: caption,
          mimetype: "video/mp4",
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        },
      );
    }
    if (mime.split("/")[0] === "audio") {
      return zassbtz.sendMessage(
        jid,
        {
          audio: await getBuffer(url),
          caption: caption,
          mimetype: "audio/mpeg",
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        },
      );
    }
  };
  /**
   *
   * @param {*} jid
   * @param {*} name
   * @param [*] values
   * @returns
   */
  /*
  zassbtz.sendPoll = (jid, name = "", values = [], selectableCount = 1) => {
    return zassbtz.sendMessage(jid, {
      poll: {
        name,
        values,
        selectableCount,
      },
    });
  };
  */
  /**
   * @typedef Media
   * @prop {"image"|"video"|"document"} type
   * @prop {buffer|{ url: string }} data
   * @prop {{}} [options]
   */
  /**
   * @typedef Button
   * @prop {Section[]} [sections]
   */
  /**
   * @typedef Section
   * @prop {string} title
   * @prop {Row[]} rows
   */
  /**
   * @typedef Row
   * @prop {string} header
   * @prop {string} title
   * @prop {string} description
   * @prop {string} id
   */
  /**
   * Function to send interactiveMessage
   *
   * @param {string} jid
   * @param {string} body
   * @param {string} [footer]
   * @param {string} title
   * @param {string} [subtitle]
   * @param {Media} [media]
   * @param {Button[]} buttons
   * @param {proto.WebMessageInfo} [quoted]
   * @param {{}} [options={}]
   * @returns {Promise<proto.WebMessageInfo>}
   */
 
    // ### End of sending message ###
  return zassbtz;
}
startsesi();

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})