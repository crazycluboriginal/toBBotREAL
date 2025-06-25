const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "userinfo",
  description: "Get information about a user",
  options: [
    {
      name: "user",
      description: "User to get information about",
      type: "USER",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    try {
      const user = interaction.options.getUser("user");
      const member = interaction.guild.members.cache.get(user.id);

      const roles = member.roles.cache.map(role => `<@&${role.id}>`).join(", ");
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`User Information for ${user.username}`)
        .setDescription(`Here is some information about ${user.username}.`)
        .setThumbnail(user.displayAvatarURL())
        .addField("Username", user.username)
        .addField("UserID", user.id)
        .addField("Account Created", user.createdAt.toDateString())
        .addField("Joined Server", member.joinedAt.toDateString())
        .addField("Roles", `> ${roles}`);
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("An error occurred:", error);
      interaction.reply("Oops! Something went wrong.");
    }
  },
};
