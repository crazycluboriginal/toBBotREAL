const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");

const EMOJIS = [ "🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭","🇮","🇯" ];

module.exports = {
  name: "poll",
  description: "Create a poll with up to 10 choices",
  options: [
    // required
    {
      name: "title",
      description: "Poll title",
      type: 3, // STRING
      required: true
    },
    {
      name: "option_1",
      description: `Choice ${EMOJIS[0]}`,
      type: 3, // STRING
      required: true
    },
    {
      name: "option_2",
      description: `Choice ${EMOJIS[1]}`,
      type: 3, // STRING
      required: true
    },
    // optional toggle
    {
      name: "single_vote",
      description: "Allow only one vote per user?",
      type: 5, // BOOLEAN
      required: false
    },
    // remaining optional choices
    ...Array.from({ length: 8 }, (_, i) => ({
      name: `option_${i + 3}`,
      description: `Choice ${EMOJIS[i + 2]}`,
      type: 3, // STRING
      required: false
    }))
  ],

  run: async (client, interaction) => {
    const title      = interaction.options.getString("title");
    const singleVote = interaction.options.getBoolean("single_vote") || false;
    const opts       = [];

    for (let i = 0; i < 10; i++) {
      const o = interaction.options.getString(`option_${i + 1}`);
      if (o) opts.push(o);
    }

    const votes = opts.map(() => new Set());

    const embed = new MessageEmbed()
      .setTitle(`📊 ${title}`)
      .setColor("RANDOM")
      .setFooter(`Poll by ${interaction.user.tag}`);

    embed.spliceFields(0, embed.fields.length);
    opts.forEach((o, i) => {
      embed.addField(`${EMOJIS[i]} ${o}`, "\u200B");
    });

    const rows = [];
    for (let i = 0; i < opts.length; i += 5) {
      const row = new MessageActionRow();
      opts.slice(i, i + 5).forEach((_, j) => {
        const idx = i + j;
        row.addComponents(
          new MessageButton()
            .setCustomId(`poll_${idx}`)
            .setEmoji(EMOJIS[idx])
            .setStyle("PRIMARY")
        );
      });
      rows.push(row);
    }

    await interaction.reply({ embeds: [embed], components: rows });
    const message = await interaction.fetchReply();

    const collector = message.createMessageComponentCollector({
      componentType: "BUTTON"
    });

    collector.on("collect", async btn => {
      const idx = Number(btn.customId.split("_")[1]);
      const bucket = votes[idx];

      if (bucket.has(btn.user.id)) {
        bucket.delete(btn.user.id);
      } else {
        if (singleVote) {
          votes.forEach(set => set.delete(btn.user.id));
        }
        bucket.add(btn.user.id);
      }

      const total = votes.reduce((sum, s) => sum + s.size, 0);
      embed.spliceFields(0, embed.fields.length);
      opts.forEach((o, i) => {
        const count = votes[i].size;
        const pct   = total ? Math.round((count / total) * 100) : 0;
        const bar   = "█".repeat(Math.round(pct / 10));
        embed.addField(`${EMOJIS[i]} ${o}`, `${bar} ${pct}% | (${count})`);
      });

      await message.edit({ embeds: [embed] });
      await btn.deferUpdate();
    });
  }
};
