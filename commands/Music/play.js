const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { getTracks, getPreview } = require("spotify-url-info");

module.exports = {
    name: "play",
    category: "Music",
    aliases: ["p" , "playsong" , "playtrack"],
    cooldown: 4,
    usage: "play <URL / TITLE>",
    description: "Plays a song from Youtube",
    run: async (client, message, args, cmduser, text, prefix) => {
    try{
      const { channel } = message.member.voice;
      if(!channel)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | Please join channel first`)
        );
      if(client.distube.isPlaying(message) && channel.id !== message.guild.me.voice.channel.id)
       return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | Please join **my** channel first`)
            .setDescription(`Channelname: \`${message.guild.me.voice.channel.name}\``)
       );
        
      if(!args[0])
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | You didn't provided a Text`)
            .setDescription(`Usage: \`${prefix}say <Your Text>\``)
        );
        message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext,ee.footericon)
        .setTitle("Searching Song")
        .setDescription(`\`\`\`fix\n${text}\n\`\`\``)
        ).then(msg=>msg.delete({timeout: 3000}).catch(e =>console.log(e.message)))
        //https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas
        if(args.join(" ").toLowerCase().includes("spotify") && args.join(" ").toLowerCase().includes("track") ){
          getPreview(args.join(" ")).then(result => {
            client.distube.play(message, result.title);
          })
        }
        else if(args.join(" ").toLowerCase().includes("spotify") && args.join(" ").toLowerCase().includes("playlist")){
          getTracks(args.join(" ")).then(result => {
            for(const song of result)
            client.distube.play(message, song.name);
          })
        }
        else {
          client.distube.play(message, text);
        }
        
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
  }
}
