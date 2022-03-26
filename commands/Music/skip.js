const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { getTracks, getPreview } = require("spotify-url-info");

module.exports = {
    name: "skip",
    category: "Music",
    aliases: ["s"],
    cooldown: 4,
    usage: "skip",
    description: "Plays a track",
    run: async (client, message, args, cmduser, text, prefix) => {
    try{
      const { channel } = message.member.voice;
      if(!channel)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | Please join channel first`)
        );
      if(!client.distube.getQueue(message))
        return message.channel.send(new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`❌ ERROR | I'm not playing Something`)
      .setDescription(`The Queue is empty`)
 );  
      if(client.distube.isPlaying(message) && channel.id !== message.guild.me.voice.channel.id)
       return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | Please join **my** channel first`)
            .setDescription(`Channelname: \`${message.guild.me.voice.channel.name}\``)
       );
      
        message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext,ee.footericon)
        .setTitle("⏭ Skipped the Current Track")
        ).then(msg=>msg.delete({timeout: 4000}).catch(e =>console.log(e.message)))
        client.distube.skip(message);         
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
