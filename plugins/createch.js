

const fs = require("fs");
const FormData = require("form-data");
const fetch = require("node-fetch");
const { getBuffer } = require("../lib/myfunc");

let handler = async (m, { zassbtz, qmsg, mime, isCreator, text, reply }) => {
  if (!isCreator) return reply(mess.creator);
  if (!text) return reply("📛 *Gunakan format:*\n.createchannel <nama>|<deskripsi>");

  let [name, desc] = text.split("|");
  if (!name) return reply("❌ Harap tuliskan nama channel.");
  desc = desc ? desc.trim() : "Tidak ada deskripsi.";

  await zassbtz.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

  let imageUrl = "https://files.catbox.moe/xpntd8.jpg";
  if (m.quoted && /image/.test(mime)) {
    try {
      const mediaPath = await zassbtz.downloadAndSaveMediaMessage(qmsg);
      const form = new FormData();
      form.append("fileToUpload", fs.createReadStream(mediaPath));
      const res = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: new URLSearchParams({
          reqtype: "fileupload",
          userhash: "",
        }),
      });

      const upload = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: form,
      });
      const url = await upload.text();
      if (url && url.startsWith("https")) imageUrl = url.trim();
      fs.unlinkSync(mediaPath);
    } catch (e) {
      console.error(e);
      reply("⚠️ Gagal upload gambar, menggunakan gambar default.");
    }
  }
  
  try {
    const newsletter = await zassbtz.newsletterCreate(name.trim(), desc, { url: imageUrl });
    const invite = newsletter?.invite || "❌ Tidak tersedia";
    const id = newsletter?.id || "❓";

    await zassbtz.sendMessage(
      m.chat,
      {
        text: `✅ *Channel Berhasil Dibuat!*\n\n📡 *Nama:* ${name}\n📝 *Deskripsi:* ${desc}\n🆔 *ID:* ${id}\n🔗 *Link:* https://whatsapp.com/channel/${invite}`,
        contextInfo: {
          externalAdReply: {
            title: name,
            body: "Channel berhasil dibuat melalui sistem PRG",
            sourceUrl: `https://whatsapp.com/channel/${invite}`,
            thumbnail: await getBuffer(imageUrl),
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );
  } catch (err) {
    console.error(err);
    reply("✖️ *Gagal membuat channel.* Pastikan akun bot kamu memenuhi syarat untuk membuat channel.");
  }
};

handler.command = ["createchannel", "createch"];
handler.tags = ["owner"];
handler.help = ["createchannel <nama>|<deskripsi>"];
module.exports = handler;