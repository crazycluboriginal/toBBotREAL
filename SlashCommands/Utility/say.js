const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  name: "say",
  description: "Make the bot repeat a message",
  options: [
    {
      name: "message",
      description: "The message to repeat",
      type: "STRING",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const messageToRepeat = interaction.options.getString("message");

    const embed = new MessageEmbed()
      .setDescription(messageToRepeat)
      .setColor("RANDOM");

    interaction.reply({ embeds: [embed] });
  },
};
