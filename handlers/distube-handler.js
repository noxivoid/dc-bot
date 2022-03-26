const Distube = require("distube");
const ee = require("../botconfig/embed.json");
const config = require("../botconfig/config.json");
const { MessageEmbed } = require("discord.js");
const { format } = require("../handlers/functions");

module.exports = (client) => {

    client.distube = new Distube(client, {
        searchSongs: false,
        emitNewSongOnly: false,
        highWaterMark: 1024*1024*64,
        leaveOnEmpty: true,
        leaveOnFinish: true,
        leaveOnStop: true,
        youtubeDL: true,
        updateYouTubeDL: true,
        customFilters: {
            "clear": "dynaudnorm=f=200",
            "bassboost": "bass=g=20,dynaudnorm=f=200",
            "8D": "apulsator=hz=0.08",
            "vaporwave": "aresample=48000,asetrate=48000*0.8",
            "nightcore": "aresample=48000,asetrate=48000*1.25",
            "phaser": "aphaser=in_gain=0.4",
            "tremolo": "tremolo",
            "vibrato": "vibrato=f=6.5",
            "reverse": "areverse",
            "treble": "treble=g=5",
            "normalizer": "dynaudnorm=f=200",
            "surrounding": "surround",
            "pulsator": "apulsator=hz=1",
            "subboost": "asubboost",
            "karaoke": "stereotools=mlev=0.03",
            "flanger": "flanger",
            "gate": "agate",
            "haas": "haas",
            "mcompand": "mcompand"
          }
    })

        
    const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

    
    client.distube
    .on("playSong", (message, queue, song) => message.channel.send(new MessageEmbed()
        .setTitle("Playing :notes: " + song.name)
        .setURL(song.url)
        .addField("Duration", `\`${song.formattedDuration}\``)
        .setColor(ee.color)
        .setThumbnail(song.thumbnail)
        .setFooter(`Requested by: ${song.user.tag}`, song.user.displayAvatarURL({dynamic: true}))
        .addField("QueueStatus", status(queue))
    ))
    .on("addSong", (message, queue, song) => message.channel.send(new MessageEmbed()
        .setTitle("Added :thumpsup: " + song.name)
        .setURL(song.url)
        .addField("Duration", `\`${song.formattedDuration}\``)
        .setColor(ee.color)
        .setThumbnail(song.thumbnail)
        .setFooter(`Requested by: ${song.user.tag}`, song.user.displayAvatarURL({dynamic: true}))    
        .addField( `${queue.songs.length} Songs in the Queue` , `Duration: ${format(queue.duration*1000)}`)
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send(
        `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
    ))
    .on("addList", (message, queue, playlist) => message.channel.send(
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
    ))
    
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
    })
   
    .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("An error encountered: " + e);
    })

    .on("initQueue", queue => {
        queue.autoplay = false;
        queue.volume = 10;
        queue.filter = "bassboost";
    });
  

}