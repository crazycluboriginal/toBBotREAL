const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "dm",
  description: "Send a direct message to a user",
  options: [
    {
      name: "user",
      description: "The user to send the message to",
      type: "USER",
      required: true,
    },
    {
      name: "message",
      description: "The message to send",
      type: "STRING",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const user = interaction.options.getUser("user");
    const messageContent = interaction.options.getString("message");

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Anonymous Message")
      .setDescription(messageContent);

    try {
      if (interaction.member.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) {
        if (user.dmChannel || await user.createDM()) {
          await user.send({ embeds: [embed] });
          interaction.reply({
            content: `Message successfully sent to ${user.tag}`,
            ephemeral: true,
          });
        } else {
          interaction.reply({
            content: "Could not send the message. The user might have DMs disabled.",
            ephemeral: true,
          });
        }
      } else {
        interaction.reply({
          content: "You don't have the necessary permissions to use this command.",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error('Error in sending DM:', error);
      if (error.code === 50007) {
        interaction.reply({
          content: "This user has their DMs closed or you can't message them.",
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: "An error occurred while sending the message.",
          ephemeral: true,
        });
      }
    }
  },
};