const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "sudo",
  description: "Execute administrative actions",
  options: [
    {
      name: "action",
      description: "Action to execute",
      type: "STRING",
      required: true,
      choices: [
        { name: "kick", value: "kick" },
        { name: "ban", value: "ban" },
        { name: "warn", value: "warn" },
      ],
    },
    {
      name: "target",
      description: "User to target",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "Reason for action",
      type: "STRING",
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const action = interaction.options.getString("action");
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason") || "No reason specified";

    if (action === "kick") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        await interaction.reply("You don't have permission to use this command!");
        return;
      }

      try {
        await target.kick(reason);
        await interaction.reply(`${target.tag} has been kicked for ${reason}`);
      } catch (error) {
        console.error(`An error occurred while trying to kick ${target.tag}: ${error}`);
        await interaction.reply(`An error occurred while trying to kick ${target.tag}.`);
      }
    } else if (action === "ban") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        await interaction.reply("You don't have permission to use this command!");
        return;
      }

      try {
        await target.ban({ reason });
        await interaction.reply(`${target.tag} has been banned for ${reason}`);
        await target.send(`You have been banned from ${interaction.guild.name} for breaking the rules.`);
      } catch (error) {
        console.error(`An error occurred while trying to ban ${target.tag}: ${error}`);
        await interaction.reply(`An error occurred while trying to ban ${target.tag}.`);
      }
    } else if (action === "warn") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
        await interaction.reply("You don't have permission to use this command!");
        return;
      }

      const embed = new MessageEmbed()
        .setTitle('You have been warned')
        .setDescription(`Reason: ${reason}`)
        .setColor('RED')
        .setTimestamp();

      try {
        await target.send({ embeds: [embed] });
        await interaction.reply(`Warned ${target.tag} for "${reason}"`);
      } catch (error) {
        console.warn(`Unable to send DM to ${target.tag}: ${error}`);
        await interaction.reply(`Warned ${target.tag} for "${reason}", but unable to DM them.`);
      }
    }
  },
};
