// Helper untuk menangani rental orders dan time-based replies
const moment = require('moment-timezone');

// Cek apakah jam sekarang dalam range reply bot (12:00 - 23:00) - WITA Timezone
function isBotReplyTime() {
  const now = moment().tz('Asia/Makassar').hour(); // WITA timezone
  return now >= 12 && now < 23; // 12:00 - 22:59
}

// Dapatkan jam sekarang dalam WITA
function getCurrentTimeWITA() {
  return moment().tz('Asia/Makassar');
}

// Hitung sisa jam reply otomatis
function getReplyTimeRemaining() {
  const now = getCurrentTimeWITA();
  const currentHour = now.hour();
  
  if (currentHour >= 12 && currentHour < 23) {
    // Dalam jam reply, hitung sisa sampai jam 23:00
    const endOfReply = moment().tz('Asia/Makassar').hour(23).minute(0).second(0);
    const duration = moment.duration(endOfReply.diff(now));
    
    let timeStr = '';
    if (duration.hours() > 0) timeStr += `${duration.hours()} jam `;
    if (duration.minutes() > 0) timeStr += `${duration.minutes()} menit`;
    if (!timeStr) timeStr = `${duration.seconds()} detik`;

    return {
      isActive: true,
      hoursRemaining: timeStr.trim(),
      endTime: endOfReply.format('HH:mm:ss')
    };
  } else {
    // Diluar jam reply, hitung sisa sampai jam 12:00 besok
    let tomorrow12 = moment().tz('Asia/Makassar').hour(12).minute(0).second(0);
    if (currentHour >= 23) {
      tomorrow12.add(1, 'day');
    } else if (currentHour < 12) {
      // already today
    }
    
    const duration = moment.duration(tomorrow12.diff(now));
    
    let timeStr = '';
    if (duration.hours() > 0) timeStr += `${duration.hours()} jam `;
    if (duration.minutes() > 0) timeStr += `${duration.minutes()} menit`;
    if (!timeStr) timeStr = `${duration.seconds()} detik`;

    return {
      isActive: false,
      hoursRemaining: timeStr.trim(),
      nextStartTime: tomorrow12.format('HH:mm:ss')
    };
  }
}

// Deteksi format rental: ps3/ps4/ps3 tv/ps4 tv/tv
function detectRentalFormat(text) {
  const rentalPatterns = [
    { pattern: /ps3\s*tv/i, label: 'ps3 tv' },
    { pattern: /ps4\s*tv/i, label: 'ps4 tv' },
    { pattern: /ps3(?!\s*tv)/i, label: 'ps3' },
    { pattern: /ps4(?!\s*tv)/i, label: 'ps4' },
    { pattern: /\btv\b/i, label: 'tv' }
  ];
  
  for (const item of rentalPatterns) {
    if (item.pattern.test(text)) return item.label;
  }
  return null;
}

// Deteksi maps (live location atau link maps)
function detectMapsFormat(text, mtype) {
  const mapsLinkPatterns = [
    /google\.com\/maps/i,
    /maps\.app\.goo\.gl/i,
    /goo\.gl\/maps/i
  ];
  
  const hasMapLink = mapsLinkPatterns.some(pattern => pattern.test(text));
  const isLiveLocation = mtype === 'liveLocationMessage' || mtype === 'locationMessage';
  
  return hasMapLink || isLiveLocation;
}

// Kirim notifikasi ke owner tentang order (rental atau maps)
async function notifyOwnerOrder(zassbtz, groupName, senderName, senderNumber, orderType, messageText, isReplied) {
  try {
    const ownerNumber = global.ownernumber.replace(/\D/g, '');
    const ownerJid = ownerNumber + '@s.whatsapp.net';
    
    const timeWITA = getCurrentTimeWITA();
    const statusReply = isReplied ? 'Sudah Reply ✔' : 'Belum Reply ❌';
    
    // orderType bisa 'maps' atau label dari rental (ps3, ps4, etc)
    const typeLabel = orderType === 'maps' ? 'Maps' : orderType;
    
    let notificationText = `*ORDER NOTIFICATION*

*Dari Group:* ${groupName}
*Pengirim:* ${senderName} (${senderNumber})
*Tipe Order:* ${typeLabel}

*Pesan Lengkap:*
${messageText}

${statusReply}

*Waktu:* ${timeWITA.format('DD-MM-YYYY HH:mm:ss')} WITA`;

    await zassbtz.sendMessage(ownerJid, { text: notificationText });
    console.log(`Notifikasi order dikirim ke owner`);
  } catch (error) {
    console.error('Gagal mengirim notifikasi order:', error.message);
  }
}

module.exports = {
  isBotReplyTime,
  getCurrentTimeWITA,
  getReplyTimeRemaining,
  detectRentalFormat,
  detectMapsFormat,
  notifyOwnerOrder
};

