const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "invite",
  description: "Get the bot's invite link",
  run: async (client, interaction) => {
    try {
      const embed = new MessageEmbed()
        .setColor('#0088cc')
        .setTitle('Add toB to your server!')
        .setDescription('[Click here to invite toBBot](https://dsc.gg/tobbot)')
        .setFooter('Thank you for using toBBot!');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending invite:', error);
      interaction.reply('Oops! Something went wrong while sending the invite link.');
    }
  },
};
