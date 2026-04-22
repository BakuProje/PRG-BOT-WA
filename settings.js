const fs = require('fs')
const chalk = require('chalk')

//——————————[ Config Owner ]——————————//
global.ownernumber = '' // Ganti nomer mu
global.ownername = 'Kuzuroken'

//——————————[ Config Bot ]——————————//
global.namabot = "PRG"
global.nomorbot = '' // Ganti no botmu
global.pair = "PRGGAMER"
global.version = '1.0'
global.autojoingc = false
global.anticall = false
global.autoreadsw = false
global.autoread = false

//——————————[ Config Sosmed ]——————————//
global.web = "https://www.prgrental.site"
global.linkSaluran = "https://whatsapp.com/channel/0029Vb7wJ5PGufIsTuKgOc3A"
global.idSaluran = "120363426230930672@newsletter"
global.nameSaluran = "Playstation Racing Game"

//——————————[ Config Wm ]——————————//
global.packname = 'Stick By PRG'
global.author = 'Kuzuroken'
global.foother = 'Made By PRG'

//——————————[ Config Payment ]——————————//
//Note : Kalau gada isi aja jadi false
global.dana = "085331569338"
global.ovo = false
global.gopay = "085331569338"
global.qris = false
global.an = {
    dana: "nama_dana",
    ovo: "nama_ovo",
    gopay: "nama_gopay"
}

//——————————[ Config Media ]——————————//
global.img = "https://files.catbox.moe/7nyjds.jpg"
global.thumbxm = "https://files.catbox.moe/7nyjds.jpg"
global.thumbbc = "https://files.catbox.moe/7nyjds.jpg"
global.thumb = [ 
    "https://files.catbox.moe/7nyjds.jpg",
    "https://files.catbox.moe/7nyjds.jpg",
    "https://files.catbox.moe/49j4go.jpg",
    "https://files.catbox.moe/7nyjds.jpg",
    "https://files.catbox.moe/7nyjds.jpg",
    "https://files.catbox.moe/7nyjds.jpg",
    "https://files.catbox.moe/7nyjds.jpg",
    "https://files.catbox.moe/7nyjds.jpg",
    "https://files.catbox.moe/7nyjds.jpg"
]

//——————————[ Config Broadcast ]——————————//
// Delay Jpm & Pushctc || 1000 = 1detik
global.delayJpm = 3500
global.delayPushkontak = 5000
global.namakontak = "AutoSave PRG"

//——————————[ Config Message ]——————————//
global.mess = {
    success: 'sᴜᴄᴄᴇssғᴜʟʏ',
    admin: '[ !! ] *sʏsᴛᴇᴍ*\nᴋʜᴜsᴜs ᴀᴅᴍɪɴ ɢʀᴏᴜᴘ',
    botAdmin: '[ !! ] *sʏsᴛᴇᴍ*\nʙᴏᴛ ʙᴇʟᴜᴍ ᴊᴀᴅɪ ᴀᴅᴍɪɴ',
    creator: '[ !! ] *sʏsᴛᴇᴍ*\nғᴇᴀᴛᴜʀᴇ ɪɴɪ ᴋʜᴜsᴜs ᴏᴡɴᴇʀ',
    group: '[ !! ] *sʏsᴛᴇᴍ*\nғᴇᴀᴛᴜʀᴇ ɪɴɪ ᴋʜᴜsᴜs ɢʀᴏᴜᴘ ᴀᴊᴀ',
    private: '[ !! ] *sʏsᴛᴇᴍ*\nғᴇᴀᴛᴜʀᴇ ᴋʜᴜsᴜs ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛ',
    wait: '[ !! ] *sʏsᴛᴇᴍ*\nᴡᴀɪᴛ ᴘʀᴏsᴇs ᴅᴜʟᴜ',
}



// *** message *** 
global.closeMsgInterval = 30; // 30 menit. maksimal 60 menit, minimal 1 menit
global.backMsgInterval = 2; // 2 jam. maksimal 24 jam, minimal 1 jam

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})
