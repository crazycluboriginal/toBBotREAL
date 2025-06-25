const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Get information about the server",
  run: async (client, interaction) => {
    try {
      const server = interaction.guild;

      const serverInfoMessage = new MessageEmbed()
        .setTitle(`Server Information for ${server.name}`)
        .setColor("BLUE")
        .addField("Owner", server.owner.user.tag, true)
        .addField("Region", server.region.toUpperCase(), true)
        .addField("Members", server.memberCount, true)
        .addField("Channels", server.channels.cache.size, true)
        .addField("Roles", server.roles.cache.size, true)
        .setThumbnail(server.iconURL({ dynamic: true }));

      interaction.reply({ embeds: [serverInfoMessage] });
    } catch (error) {
      console.error("An error occurred:", error);
      interaction.reply("Oops! Something went wrong.");
    }
  },
};
