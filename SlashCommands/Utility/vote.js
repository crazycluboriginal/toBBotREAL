const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "vote",
  description: "Vote for the bot in discordbotlist and top.gg!",
  run: async (client, interaction) => {
    try {
    const embed = new MessageEmbed()
    .setColor('#00FF00')
    .setTitle(`Vote for toBBot`)
    .setDescription(`Vote to support toBBot! You may vote on [top.gg](https://top.gg/bot/704185963483496506/vote) and [discordbotlist](https://discordbotlist.com/bots/tobbot/upvote) once every 12 hours!`)
    .setURL("https://top.gg/bot/704185963483496506/")
    .addField('Vote on top.gg','[top.gg](https://top.gg/bot/704185963483496506/vote)')
    .addField("Vote on discordbotlist","[discordbotlist](https://discordbotlist.com/bots/tobbot/upvote)")
.setThumbnail("https://cdn.discordapp.com/emojis/982309135494303804.png")
    .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending invite:', error);
      interaction.reply('Oops! Something went wrong while sending the invite link.');
    }
  },
};
