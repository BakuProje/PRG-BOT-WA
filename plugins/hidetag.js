

let handler = async (m, { zassbtz, isAdmins, isBotAdmins, text, participants, reply }) => {
  if (!m.isGroup) return reply(mess.group);
  if (!isAdmins) return reply(mess.admin);
  if (!isBotAdmins) return reply(mess.botAdmin);

  let message = text || m.quoted?.text;
  if (!message) return reply('Kirim teks atau reply pesan untuk dihidetag.');

  let member = participants.map(u => u.id);
  await zassbtz.sendMessage(m.chat, { text: message, mentions: member });
};

handler.command = ['hidetag', 'ht'];
handler.tags = ['group'];
handler.help = ['hidetag'];
module.exports = handler;